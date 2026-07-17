"use server";

import { CartItem } from "@/types";
export async function addItemToCart(data: CartItem) {
  return {
    success: true,
    message: `${data.name} added to the cart.`,
  };
}
