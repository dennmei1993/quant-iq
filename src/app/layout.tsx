import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className="max-w-6xl mx-auto">

        <Navbar />

        <main className="px-6">
          {children}
        </main>

        <Footer />

      </body>
    </html>
  )

}

export const metadata = {
  title: "Quant IQ",
  description: "AI-powered market intelligence platform"
};