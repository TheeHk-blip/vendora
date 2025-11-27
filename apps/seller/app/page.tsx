import { Metadata } from "next";
import Image from "next/image";

export const metadata:Metadata =  ({
  title: "Seller | Vendora",
  description: "Manage your store conviniently with industry leading tools"
})

export default function Home() {
  return (
    <div className="flex justify-center">
      <span>Seller</span>
    </div>
  );
}
