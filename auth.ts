import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
type AuthUser = User & { role?: string };

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
      user,
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
      // Assign user fields to token
      if (user) {
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
