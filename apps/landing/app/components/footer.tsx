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
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Vendora is a multi-tenant e-commerce SaaS platform where sellers grow their
            businesses and buyers discover quality products—all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <main  aria-description="Links to various Vendora products such as our marketplace, subscription plans and about us">
          <h2 className={title({ color: "blue", size: 'xs'})}>Explore</h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li><Link prefetch={false} href={process.env.NEXT_PUBLIC_STORE_URL!} className="hover:text-foreground transition">Shop</Link></li>
            <li><Link prefetch={false} href="/pricing" className="hover:text-foreground transition">Pricing</Link></li>
            <li><Link prefetch={false} href="/onboarding" className="hover:text-foreground transition">Join Vendora</Link></li>
            <li><Link prefetch={false} href="/about" className="hover:text-foreground transition">About Us</Link></li>
          </ul>
        </main>

        {/* For Sellers */}
        <div  aria-description="Resources for our sellers">
          <h3 className={title({ color: "blue", size: 'xs'})}>For Sellers</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li><Link prefetch={false} href={process.env.NEXT_PUBLIC_SELLER_URL!} className="hover:text-foreground transition">Seller Dashboard</Link></li>
            <li><Link prefetch={false} href="/help-center" className="hover:text-foreground transition">Help Center</Link></li>
            <li><Link prefetch={false} href="/terms" className="hover:text-foreground transition">Terms & Conditions</Link></li>
            <li><Link prefetch={false} href="/privacy" className="hover:text-foreground transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h4 className={title({ color: "blue", size: 'xs'})}>Connect</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Have questions? Reach us at {" "}
            <a href="mailto:support@support.vendora.sbs" className="text-blue-600">
              support@vendora.sbs
            </a>   
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-10 pt-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Vendora. All rights reserved.
      </div>
    </footer>
  );
}