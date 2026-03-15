export default function Navbar() {

  return (
    <nav className="flex justify-between items-center p-6 border-b">

      <div className="text-xl font-bold">
        Quant IQ
      </div>

      <div className="space-x-6">

        <a href="/">Home</a>
        <a href="/themes">Themes</a>
        <a href="/assets">Assets</a>
        <a href="/macro">Macro</a>

      </div>

    </nav>
  )

}