import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Vendora",
  description: "Welcome to Vendora, the ultimate marketplace solution for buyers and sellers. Discover a wide range of products, connect with trusted sellers, and enjoy a seamless shopping experience all in one place."
}

export default function Home() {
  return(
    <div className="flex flex-col justify-center px-2 py-2 w-full max-w-7xl" >
      <h1 className="text-3xl font-bold">Welcome to Vendora</h1>
    </div>
  )
}