import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    name: string;
    email: string;
    image?: string;
    password?: string;
    hasPassword?: boolean;
  }

  interface Session {
    user: {
      _id: string;
      role: string;
      name: string;
      email: string;
      image?: string;
      hasPassword?: boolean;
    }
  }
}