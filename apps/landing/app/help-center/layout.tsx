import { Metadata } from "next"

export const metadata: Metadata = ({
  title: "Help Center | Vendora",
  description: "Find answers to common questions and get support for Vendora's e-commerce platform.",
})

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div  className="min-h-screen px-4 md:px-8 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {children}
      </div>
    </div>
  )
}