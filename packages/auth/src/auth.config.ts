import type { NextAuthOptions } from "next-auth";

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/signin"
  },
  providers: []
} satisfies NextAuthOptions;