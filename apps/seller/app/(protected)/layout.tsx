import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ActiveSessionProvider, ThemeProvider } from "@vendora/ui";
import SideBar from "./components/sidebar";
import Navbar from "./components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seller | Vendora",
  description: "Your all round business management tool",
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
        suppressHydrationWarning
      >
        <ActiveSessionProvider>
          <ThemeProvider>
            <div className="flex flex-row max-w-7xl">
              <div>
                <SideBar />
              </div>
              <div className="flex flex-col w-full max-w-full" >
                <Navbar />
                <main className="container px-2" >
                  {children}
                </main>
              </div> 
            </div>
          </ThemeProvider>  
        </ActiveSessionProvider>             
      </body>
    </html>
  );
}
