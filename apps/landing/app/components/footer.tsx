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
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-10">
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
          <h2>Explore</h2>
          <ul className="space-y-2 ml-1 text-sm text-gray-600 dark:text-gray-300">
            <li><a href={process.env.NEXT_PUBLIC_STORE_URL!} className="hover:text-foreground transition">Shop</a></li>
            <li><Link prefetch={false} href="/pricing" className="hover:text-foreground transition">Pricing</Link></li>
            <li><Link prefetch={false} href="/onboarding" className="hover:text-foreground transition">Join Vendora</Link></li>
            <li><Link prefetch={false} href="/help-center" className="hover:text-foreground transition">Help Center</Link></li>            
          </ul>
        </main>        

        <div>
          <h2>Legal</h2>
          <ul className="space-y-2 ml-1 text-sm text-gray-600 dark:text-gray-300">
            <li><Link prefetch={false} href="/privacy" className="hover:text-foreground transition">Privacy Policy</Link></li>
            <li><Link prefetch={false} href="/terms" className="hover:text-foreground transition">Terms</Link></li>
          </ul>                    
        </div>
      </div>

      {/* Divider */}
      <div className="text-center my-5 py-2.5 gap-1 border-t border-gray-500 dark:border-gray-400 text-gray-600 dark:text-gray-300">        
        © {new Date().getFullYear()} Vendora. All rights reserved. 
      </div>
    </footer>
  );
}