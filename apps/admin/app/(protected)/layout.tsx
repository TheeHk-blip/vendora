import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navigation from "./components/sidebar";  
import Nav from "./components/navbar";
import { ActiveSessionProvider, CurrencyProvider, DrawerProvider, ThemeProvider, ToastProvider } from "@vendora/ui"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
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
            <CurrencyProvider>
            <DrawerProvider>
            <ToastProvider>
              <div className="flex flex-row max-w-7xl" > 
                <div className="hidden md:flex">
                  <Navigation />     
                </div>        
                <div className="flex flex-col w-full max-w-full" >  
                  <div className="flex md:hidden sticky top-0 z-50">
                    <Nav /> 
                  </div>                                                                                                  
                  <main className="container px-2.5 my-2.5">             
                    {children} 
                  </main>
                </div>
              </div>
            </ToastProvider>
            </DrawerProvider>
            </CurrencyProvider>
          </ThemeProvider>    
        </ActiveSessionProvider>                   
      </body>
    </html>
  );
}
