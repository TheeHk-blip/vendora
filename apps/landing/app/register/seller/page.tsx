import { Metadata } from "next";
import SellerRegistration from "./components/page";

export const metadata: Metadata = ({
  title: "Seller Registration | Vendora",
  description: "Seller registration page"
});

export default function SellerRegisterPage() {
  return <SellerRegistration />
}