import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/navbar";
import { ThemeProvider } from "@vendora/ui/src/providers/theme";
import { ActiveSessionProvider } from "@vendora/ui/src/providers/session";
import { ToastProvider } from "@vendora/ui/src/context/toastContext";
import { CurrencyProvider } from "@vendora/ui/src/context/currencyContext";
import { DrawerProvider } from "@vendora/ui/src/context/drawerContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Store | Vendora",
  description: "Your one stop online store",
};


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
        <ThemeProvider> 
          <ActiveSessionProvider>
          <ToastProvider>
          <CurrencyProvider>   
          <DrawerProvider>  
            <div className="flex flex-col min-h-screen max-w-full">   
              <Navigation />             
              <main className="container max-w-full px-2.5">               
                {children}
              </main>                 
            </div>
          </DrawerProvider>      
          </CurrencyProvider>  
          </ToastProvider>
          </ActiveSessionProvider>
        </ThemeProvider>       
      </body>
    </html>
  );
}
