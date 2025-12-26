import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navigation from "./components/sidebar";  
import Nav from "./components/navbar";
import { ActiveSessionProvider, ThemeProvider } from "@vendora/ui"

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
            <div className="flex flex-row max-w-7xl" > 
              <div>
                <Navigation />     
              </div>        
              <div className="flex flex-col w-full max-w-full" >     
                <Nav />                                                                              
                <main className="container px-2.5">             
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
