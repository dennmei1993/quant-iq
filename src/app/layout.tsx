import "./globals.css"
import Sidebar from "@/components/Sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">

        <div className="flex h-screen">

          <Sidebar />

          <main className="flex-1 overflow-auto">
            {children}
          </main>

        </div>

      </body>
    </html>
  )
}