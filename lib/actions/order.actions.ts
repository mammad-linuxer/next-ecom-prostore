"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validator";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";

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
