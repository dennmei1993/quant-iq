export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r">

      <div className="p-4 text-xl font-bold">
        Quant IQ
      </div>

      <nav className="flex flex-col gap-2 p-4">

        <a href="/dashboard" className="hover:bg-gray-100 p-2 rounded">
          Dashboard
        </a>

        <a href="/themes" className="hover:bg-gray-100 p-2 rounded">
          Themes
        </a>

        <a href="/assets" className="hover:bg-gray-100 p-2 rounded">
          Assets
        </a>

        <a href="/macro" className="hover:bg-gray-100 p-2 rounded">
          Macro
        </a>

        <a href="/signals" className="hover:bg-gray-100 p-2 rounded">
          Signals
        </a>

      </nav>

    </aside>
  )
}