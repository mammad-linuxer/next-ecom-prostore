import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CartItem } from "@/types";
import { prisma } from "@/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { cookies } from "next/headers";
//import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import { calcPrice } from "@/lib/utils";
import { Prisma } from "@prisma/client";
type AuthUser = User & { role?: string };

// Merge guest and user Cart Items
async function mergeCartItems(
  existingItems: CartItem[],
  guestItems: CartItem[],
) {
  const mergedItems = [...existingItems];

  for (const item of guestItems) {
    const existingItem = mergedItems.find(
      (cartItem) => cartItem.productId === item.productId,
    );
    if (existingItem) {
      const product = await prisma.product.findFirst({
        where: { id: item.productId },
      });
      existingItem.qty = Math.min(existingItem.qty + item.qty, product!.stock);
    } else {
      mergedItems.push(item);
    }
  }
  return mergedItems;
}

export const config = {
  ...authConfig,
  pages: {
    signIn: "/sign-in",
    error: "sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        // check if user exists and password is correct
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password,
          );
          // If password is correct, return user object
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user doesn't exist or password is incorrect, return NULL
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks, // brings in `authorized`
    async session({
      session,
      // user,
      trigger,
      token,
    }: {
      session: Session;
      user: AuthUser;
      trigger?: "update" | "signIn" | "signUp";
      token: JWT;
    }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.name = token.name;

        (session.user as AuthUser).role =
          typeof token.role === "string" ? token.role : undefined;

        if (trigger === "update" && token.name) {
          session.user.name = token.name;
        }
      }

      return session;
    },
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user?: AuthUser;
      trigger?: "update" | "signIn" | "signUp";
      session?: Session;
    }) {
      // Assign user fields/properties to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // If user has no name, use email as their default name
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          // update the user in the database with the new name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (!sessionCartId) {
            return token;
          }

          const guestCart = await prisma.cart.findFirst({
            where: { sessionCartId },
          });

          if (!guestCart) {
            return token;
          }

          const existingUserCart = await prisma.cart.findFirst({
            where: { userId: user.id },
          });

          if (!existingUserCart) {
            await prisma.cart.update({
              where: { id: guestCart.id },
              data: { userId: user.id },
            });
            return token;
          }

          const mergedItems = await mergeCartItems(
            existingUserCart.items as CartItem[],
            guestCart.items as CartItem[],
          );

          const totals = calcPrice(mergedItems);

          await prisma.cart.update({
            where: { id: existingUserCart.id },
            data: {
              items: mergedItems as Prisma.CartUpdateitemsInput[],
              ...totals,
              sessionCartId,
            },
          });

          await prisma.cart.delete({ where: { id: guestCart.id } });
          //////////////////// The Modified Brad Way //////////////////
          /*
          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              const existingUserCart = await prisma.cart.findFirst({
                where: { userId: user.id },
              });

              if (existingUserCart && existingUserCart.id !== sessionCart.id) {
                // Overwrite any existing user cart
                await prisma.cart.deleteMany({
                  where: { userId: user.id, id: { not: sessionCart.id } },
                });
              }

              if (sessionCart.userId !== user.id) {
                // Assign the guest cart to the logged-in user
                await prisma.cart.update({
                  where: { id: sessionCart.id },
                  data: { userId: user.id },
                });
              }
            }
          }
          */
          //////////////////// The Modified Brad way ///////////////////////////
        }
      }
      // Handle session updates (like name changes)
      if (session?.user?.name && trigger === "update") {
        token.name = session.user.name;
      }
      return token;
    },
    ////////////////
    /*
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      // Check for cart cookie
      if (!request.cookies.get("sessionCartId")) {
        // Generate  cart cookie
        const sessionCartId = crypto.randomUUID();
        // Clone the request headers
        const newRequestHeaders = new Headers(request.headers);
        
        // Create a new response and the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        
        // Set the newly generated sessionCartId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);
        
        // Return the response with the sessionCartId se
        return response;
        
      } else {
        return true;
      }
    },
    */
    ////////////////////
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
