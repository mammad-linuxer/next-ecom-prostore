import { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  // trustHost: true,
  pages: {
    signIn: "/sign-in",
    error: "sign-in",
  },
  providers: [],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      // Array of regex patterns of protected paths
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      // Get pathname from the req URL object
      const { pathname } = request.nextUrl;

      // Check if user is not authenticated and on a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      // Check for cart cookie
      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();

        const newRequestHeaders = new Headers(request.headers);
        const response = NextResponse.next({
          request: { headers: newRequestHeaders },
        });

        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;
