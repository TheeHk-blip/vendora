"use server";
import { signIn } from "next-auth/react";

export async function Login(formData: FormData) {
  const action = formData.get("action");
  await signIn(action as string, undefined, { redirect: ("/")})
}