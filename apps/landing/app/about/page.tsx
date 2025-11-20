import { Metadata } from "next";
import AboutUs from "./components/about";

export const metadata: Metadata = ({
  title: "About Us | Vendora",
  description:  "Learn what vendora is all about."
})

export default function AboutPage() {
  return <AboutUs />
}
