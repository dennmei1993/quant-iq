export default function ThemesPreview() {

  const themes = [
    "Artificial Intelligence",
    "Energy Transition",
    "Defense Spending",
    "Obesity Drugs"
  ]

  return (
    <section style={{
      maxWidth:1100,
      margin:"80px auto"
    }}>

      <h2>Emerging Market Themes</h2>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(4,1fr)",
        gap:20,
        marginTop:20
      }}>

        {themes.map((theme,i)=>(
          <div key={i} style={{
            padding:24,
            border:"1px solid #eee",
            borderRadius:10
          }}>
            {theme}
          </div>
        ))}

      </div>

    </section>
  )
}