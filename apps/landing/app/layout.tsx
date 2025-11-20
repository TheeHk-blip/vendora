import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider, DrawerProvider } from "@vendora/ui";
import "./globals.css";
import Navigation from "./components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Index | vendora",
  description: "Welcome to vendora",
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
          <DrawerProvider>
            <div className="flex flex-col min-h-screen max-w-full" >
              <Navigation />
              <main className="container max-w-full" >
                {children}
              </main> 
            </div>   
          </DrawerProvider>
        </ThemeProvider>                    
      </body>
    </html>
  );
}
