export default function Navbar() {

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b">

      <div className="text-xl font-bold">
        Quant IQ
      </div>

      <div className="flex gap-6 text-sm">

        <a href="/" className="hover:text-blue-600">Home</a>
        <a href="/themes" className="hover:text-blue-600">Themes</a>
        <a href="/assets" className="hover:text-blue-600">Assets</a>
        <a href="/macro" className="hover:text-blue-600">Macro</a>

      </div>

    </nav>
  )

}