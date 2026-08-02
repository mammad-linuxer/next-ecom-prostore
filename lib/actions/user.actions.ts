"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn, signOut } from "@/auth";
import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFromSchema,
} from "../validator";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import { cookies } from "next/headers";

// Sign in the use with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, message: "Signed in Successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password." };
  }
}

// Sign the user out
export async function signOutUser() {
  //const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  (await cookies()).delete('sessionCartId')
  await signOut();
  //await prisma.cart.delete({ where: { sessionCartId: sessionCartId } });
}

//Register a new user
export async function signUp(pervState: unknown, formData: FormData) {
  try {
    const user = signUpFromSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });
    return { success: true, message: "User created successfully!" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

// Get User By ID

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User Not Found!");
  return user;
}

// Update user's address

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User Not Found");

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: "User updated successfully!",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
