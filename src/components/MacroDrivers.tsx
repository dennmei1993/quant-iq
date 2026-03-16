export default function MacroDrivers() {

  const drivers = [
    "US AI industrial policy",
    "Semiconductor demand surge",
    "Cloud capex expansion"
  ]

  return (
    <section style={{marginTop:40}}>

      <h2>Macro Drivers</h2>

      <ul>
        {drivers.map((d,i)=>(
          <li key={i}>{d}</li>
        ))}
      </ul>

    </section>
  )
}