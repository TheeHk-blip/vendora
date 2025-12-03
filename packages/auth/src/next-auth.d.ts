import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

interface ExtendedUser extends DefaultUser {
  id: string;
}

interface ExtendedSession extends DefaultSession {
  user: ExtendedUser
}