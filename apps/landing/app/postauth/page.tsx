import { Metadata } from "next";
import PostAuth from "./components/postauth";

export const metadata: Metadata = ({
  title: "Post Auth | Vendora",
  description: "Enabling seamless authentication"
})

export default function PostAuthPage() {
  return <PostAuth />
}
