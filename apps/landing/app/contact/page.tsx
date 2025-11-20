import { Metadata } from "next";
import ContactUs from "./components/contact";

export const metadata: Metadata = ({
  title: "Contact Us | Vendora",
  description: "Do you have any sugestions, or inquiries? Reach out!"
});

export default function ContactPage() {
  return <ContactUs />
}
