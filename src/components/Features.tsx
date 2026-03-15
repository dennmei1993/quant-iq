export default function Features() {

  const features = [
    {
      title: "Theme Intelligence",
      description: "Identify the themes driving markets."
    },
    {
      title: "Macro Signals",
      description: "Track global events impacting assets."
    },
    {
      title: "Asset Insights",
      description: "Understand which companies benefit."
    }
  ]

  return (

    <section className="grid grid-cols-3 gap-8 py-16">

      {features.map((f) => (

        <div key={f.title} className="p-6 border rounded">

          <h3 className="font-semibold text-lg mb-2">
            {f.title}
          </h3>

          <p className="text-gray-600">
            {f.description}
          </p>

        </div>

      ))}

    </section>

  )

}