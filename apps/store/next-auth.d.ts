import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

interface ExtendedUser extends DefaultUser {
  _id: string;
}

interface ExtendedSession extends DefaultSession {
  user: ExtendedUser
}

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
      isVerified?: boolean;
      hasPassword?: boolean;
    }
  }
}