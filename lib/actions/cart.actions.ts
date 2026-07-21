"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@/auth";
import { formatError } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validator";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { Prisma } from "@prisma/client";
import { convertToPlainObject } from "../utils";
import { totalmem } from "os";

// Add item to cart in database
export async function addItemToCart(data: CartItem) {
  try {
    // Check for session cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session Not Found.");

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get Cart from database
    const cart = await getMyCart();

    // Parse and validate submitted data
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    // Console the Results
    console.log({
      "Session Cart ID": sessionCartId,
      "user ID": userId,
      "Item Requested": item,
      Product: product,
      Cart: cart,
    });
    return {
      success: true,
      message: `Testing Cart.`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get user cart from DB
export async function getMyCart() {
  // Check for session cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart Session Not Found."); // or return undefined

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // Convert Decimal values to strings or compatibility with AddToCart component
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
