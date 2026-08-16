"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validator";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult } from "@/types";
import { convertToPlainObject } from "../utils";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Create Order
export const createOrder = async () => {
  try {
    // Get session, cart and user:
    const session = await auth();
    if (!session) throw new Error("User is not authenticated!");

    const cart = await getMyCart();

    const userId = await session.user?.id;
    if (!userId) throw new Error("user Id not found!");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your Cart Is Empty!",
        redirectTo: "/cart",
      };
    }

    if (!user.address) {
      return {
        success: false,
        message: "Please add a Shipping Address!",
        redirectTo: "/shipping-address",
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: "Please select a Payment Method!",
        redirectTo: "/payment-method!",
      };
    }

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    // Create a transaction to create order and  order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const txClient = tx as typeof prisma;
      // Create order
      const insertedOrder = await txClient.order.create({ data: order });
      // Create order items from the cart items

      for (const item of cart.items as CartItem[]) {
        await txClient.orderItem.create({
          data: { ...item, price: item.price, orderId: insertedOrder.id },
        });
      }
      // Clear cart
      await txClient.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order Not Created!");

    return {
      success: true,
      message: "Order Successfully  Created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
};

export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!data) throw new Error("No Order Found");

  // This is another type of handling Decimal type of Prices for Order
  return convertToPlainObject({
    ...data,
    itemsPrice: data!.itemsPrice.toString(),
    taxPrice: data!.taxPrice.toString(),
    shippingPrice: data!.shippingPrice.toString(),
    totalPrice: data!.totalPrice.toString(),
    orderItems: data.orderItems.map((item) => {
      return {
        ...item,
        price: item.price.toString(),
      };
    }),
  });
}

// Get User Orders

export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error("User Not Authenticated!");

  const userId = session.user!.id;

  if (!userId) throw new Error("User Id not found!");

  const data = await prisma.order.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: userId },
  });

  return {
    data: data.map((item) => {
      return {
        ...item,
        itemsPrice: item.itemsPrice.toString(),
        shippingPrice: item.shippingPrice.toString(),
        taxPrice: item.taxPrice.toString(),
        totalPrice: item.totalPrice.toString(),
      };
    }),
    totalPage: Math.ceil(dataCount / limit),
  };
}

type SalesDataType = {
  month: string;
  totalSales: number;
}[];
// Get sales data and order summary
export async function getOrderSummary() {
  // Get counts for each source
  const ordersCount = await prisma.order.count();
  const usersCount = await prisma.user.count();
  const productsCount = await prisma.product.count();

  // Calculate total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt",'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales), // Convert Decimal to Number
  }));

  // Get Latest sales
  const latestOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    salesData,
    latestOrders,
  };
}

// Get all orders (as admin)
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete Order
export async function deleteOrder(id: string) {
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/orders");

  return {
    success: true,
    message: "Order deleted successfully!",
  };
  try {
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update Order to "Paid" in DB
async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  // Find the order in the DB and include th order items
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderItems: true },
  });

  if (!order) throw new Error("Order not Found!");

  if (order.isPaid) throw new Error("Order Already Paid!");

  // Transaction to update the order and update the product quantities
  await prisma.$transaction(async (tx) => {
    // update all items quantities in th Database
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    // Set the Order to paid
    await tx.order.update({
      where: { id: orderId },
      data: { isPaid: true, paidAt: new Date(), paymentResult },
    });
  });

  // Get the updated order after the transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error("Order Not Found!");
}

// Update order to Paid by Cash On Delivery
export async function updateOrderToPaidByCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId });

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: "Order Paid Successfully!" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update order to Delivered
export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({ where: { id: orderId } });

    if (!order) throw new Error("Order Not Found!");

    if (!order.isPaid) throw new Error("Order is Not Paid!");

    await prisma.order.update({
      where: { id: orderId },
      data: { isDelivered: true, deliveredAt: new Date() },
    });

    revalidatePath(`/order${orderId}`);

    return { success: true, message: "Order Delivered Successfully!" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
