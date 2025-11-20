import { Metadata } from "next";
import BuyerRegistration from "./components/buyer";

export const metadata: Metadata = ({
  title: "Buyer Registration | Vendora",
  description: "Buyer registration page"
})


export default function BuyerRegisterPage() {
  return <BuyerRegistration />
}
