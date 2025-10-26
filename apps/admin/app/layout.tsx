import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation, { Nav } from "./components/navbar";
import { Card, DrawerProvider, ThemeProvider } from "@vendora/ui";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "admin.vendora",
  description: "Vendora Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >     
        <ThemeProvider>
          <div className="flex flex-row max-w-full" > 
            <div>
              <Navigation />     
            </div>        
            <div className="flex flex-col container" >
              <Nav />                                      
              <main className="container px-2.5 mt-2.5">             
                {children} 
              </main>
            </div>
          </div>
        </ThemeProvider>                       
      </body>
    </html>
  );
}
