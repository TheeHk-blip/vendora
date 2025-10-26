import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    name: string;
    email: string;
    password?: string;
    hasPassword?: boolean;
  }

  interface Session {
    user: {
      role: string;
      name: string;
      email: string;
      image?: string;
      hasPassword?: boolean;
    }
  }
}