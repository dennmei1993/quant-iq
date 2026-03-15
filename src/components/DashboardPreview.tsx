export default function DashboardPreview() {

  return (

    <section className="py-20">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Market Themes Right Now
      </h2>

      <div className="grid grid-cols-3 gap-6">

        <div className="border p-4 rounded">
          AI Infrastructure
        </div>

        <div className="border p-4 rounded">
          Energy Security
        </div>

        <div className="border p-4 rounded">
          Defense Technology
        </div>

      </div>

    </section>

  )

}