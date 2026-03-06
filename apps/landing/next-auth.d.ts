import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    name: string;
    email: string;
    image?: string;
    password?: string;
    isVerified?: boolean;
    hasPassword?: boolean;
  }

  interface Session {
    user: {
      _id: string;
      role: string;
      name: string;
      email: string;
      image?: string;
      isVerified: boolean;
      hasPassword?: boolean;
    }
  }
}