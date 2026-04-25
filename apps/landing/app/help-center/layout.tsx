import { Metadata } from "next"

export const metadata: Metadata = ({
  title: "Help Center | Vendora",
  description: "Explore FAQs, guides, and support resources to manage your Vendora account and dashboard.",
})

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <main  
      aria-label="Help Center, find guides and support resources regarding how to use Vendora"
      className="min-h-screen px-4 md:px-8 py-4"
    >
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </main>
  )
}