import "./globals.css";

export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
  return(
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  )
}