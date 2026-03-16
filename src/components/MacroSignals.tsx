export default function MacroSignals() {

  const signals = [
    "US CPI surprise upside",
    "China stimulus announcement",
    "Oil supply disruption",
  ]

  return (
    <section style={{
      background:"#f9fafb",
      padding:"80px 20px"
    }}>

      <div style={{
        maxWidth:1100,
        margin:"auto"
      }}>

        <h2>Latest Macro Signals</h2>

        <ul style={{marginTop:20}}>
          {signals.map((s,i)=>(
            <li key={i} style={{marginBottom:10}}>
              {s}
            </li>
          ))}
        </ul>

      </div>

    </section>
  )
}