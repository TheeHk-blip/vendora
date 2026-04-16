import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ActiveSessionProvider, CurrencyProvider, DrawerProvider, ThemeProvider, ToastProvider } from "@vendora/ui";
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
            <DrawerProvider>
            <CurrencyProvider>
            <ToastProvider>
              <div className="flex flex-row w-full">
                <div className="hidden md:flex" >
                  <SideBar />
                </div>
                <div className="flex flex-col w-full" >
                  <div className="flex md:hidden sticky top-0 z-50" >
                    <Navbar />
                  </div>                  
                  <main className="w-full px-2.5 md:my-2.5" >
                    {children}
                  </main>
                </div> 
              </div>
            </ToastProvider>
            </CurrencyProvider>
            </DrawerProvider>
          </ThemeProvider>  
        </ActiveSessionProvider>             
      </body>
    </html>
  );
}
