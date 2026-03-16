export default function DashboardHeader() {
  return (
    <div className="bg-white border-b p-4 flex justify-between">

      <h1 className="text-xl font-semibold">
        Market Intelligence Dashboard
      </h1>

      <input
        placeholder="Search assets or themes..."
        className="border rounded px-3 py-1"
      />

    </div>
  )
}