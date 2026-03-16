export default function Features() {

  const features = [
    {
      title: "Theme Intelligence",
      desc: "Identify emerging investment themes across global markets."
    },
    {
      title: "Macro Signals",
      desc: "Structured macro events and signals impacting markets."
    },
    {
      title: "Asset Discovery",
      desc: "Explore equities, ETFs, and sectors linked to themes."
    }
  ]

  return (
    <section style={{
      padding:"80px 40px",
      maxWidth:1100,
      margin:"auto"
    }}>
      
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(3,1fr)",
        gap:30
      }}>

        {features.map((f,i)=>(
          <div key={i} style={{
            padding:30,
            border:"1px solid #eee",
            borderRadius:10
          }}>
            <h3>{f.title}</h3>
            <p style={{color:"#555"}}>{f.desc}</p>
          </div>
        ))}

      </div>

    </section>
  )
}