import { Metadata } from "next";
import SignIn from "./components/signin";

export const metadata: Metadata = ({
  title: "Sign in | Vendora",
  description: "Vendora sign-in page"
})

export default function SignInPage() {
  return <SignIn />
}