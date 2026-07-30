import React from "react";
import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "Shipping Address",
};
const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();

  const userId = session?.user?.id;
  if (!userId) {
    // in order not to break the app, we can use this instead of throwing an error:
    redirect("/sign-in");
    // throw new Error("User Not Found!");
  }
  const user = await getUserById(userId);
  return <>Shipping Address Page</>;
};

export default ShippingAddressPage;
