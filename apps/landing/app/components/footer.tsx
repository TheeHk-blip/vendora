import { Twitter, LinkedIn, Facebook, Instagram } from "@mui/icons-material";
import { title } from "@vendora/ui";
import Link from "next/link";
import { Limelight } from "next/font/google";

const limelight = Limelight({
  subsets: ["latin"],
  variable: "--font-limelight",
  weight: ["400"]
});

export default function Footer() {
  return (
    <footer className="py-10 px-6 md:px-16 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div>
          <h1 className={title({ color: "blue", size: 'xs', className: limelight.className })}>Vendora</h1>
          <p className="text-sm ml-2.5 text-gray-600 dark:text-gray-300">
            Vendora is a multi-tenant e-commerce SaaS platform where sellers grow their
            businesses and buyers discover quality products—all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className={title({ color: "blue", size: 'xs'})}>Explore</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li><Link href="http://localhost:3001/" className="hover:text-foreground transition">Shop</Link></li>
            <li><Link href="/pricing" className="hover:text-foreground transition">Pricing</Link></li>
            <li><Link href="/onboarding" className="hover:text-foreground transition">Join Vendora</Link></li>
            <li><Link href="/about" className="hover:text-foreground transition">About Us</Link></li>
          </ul>
        </div>

        {/* For Sellers */}
        <div>
          <h3 className={title({ color: "blue", size: 'xs'})}>For Sellers</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li><Link href="/dashboard" className="hover:text-foreground transition">Seller Dashboard</Link></li>
            <li><Link href="/help-center" className="hover:text-foreground transition">Help Center</Link></li>
            <li><Link href="/faqs" className="hover:text-foreground transition">FAQs</Link></li>
            <li><Link href="/terms" className="hover:text-foreground transition">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className={title({ color: "blue", size: 'xs'})}>Connect</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Have questions? Reach us at <span className="text-blue-600">support@vendora.com</span>
          </p>
          <div className="flex gap-4 text-gray-600 dark:text-gray-300">
            <Link href="#" className="hover:text-foreground transition"><Facebook /></Link>
            <Link href="#" className="hover:text-foreground transition"><Twitter /></Link>
            <Link href="#" className="hover:text-foreground transition"><Instagram /></Link>
            <Link href="#" className="hover:text-foreground transition"><LinkedIn /></Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-10 pt-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Vendora. All rights reserved.
      </div>
    </footer>
  );
}