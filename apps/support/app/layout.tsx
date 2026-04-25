import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "./components/navbar";
import { ActiveSessionProvider, ThemeProvider, ToastProvider } from "@vendora/ui";
import { SideNavigation } from "./components/sidenav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Support | Vendora",
  description: "Whatever issue you are going through our support staff will handle it for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <div className="flex flex-col min-h-screen max-w-full gap-1"> 
          <ThemeProvider>  
            <ActiveSessionProvider>
              <ToastProvider>
                <div className="flex flex-row max-w-full">
                  <SideNavigation />
                  <div className="flex flex-col">
                    <Navigation />             
                    <main className="container max-w-full px-2.5 pb-2">               
                      {children}
                    </main>    
                  </div>
                </div>
              </ToastProvider>
            </ActiveSessionProvider>
          </ThemeProvider>             
        </div>
      </body>
    </html>
  );
}
