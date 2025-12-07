import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider, DrawerProvider, ActiveSessionProvider, } from "@vendora/ui";
import "./globals.css";
import Navigation from "./components/navbar";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vendora",
  description: "Vendora is a multi-tenant e-commerce SaaS platform where sellers grow their businesses and buyers discover quality products—all in one place."            
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ActiveSessionProvider>
          <ThemeProvider>
            <DrawerProvider>
              <div className="flex flex-col min-h-screen max-w-full" >
                <Navigation />
                <main className="container max-w-full" >
                  {children}
                </main> 
              </div>   
            </DrawerProvider>
          </ThemeProvider> 
        </ActiveSessionProvider>                   
      </body>
    </html>
  );
}
