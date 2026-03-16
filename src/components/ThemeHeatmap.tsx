export default function ThemeHeatmap(){

  const themes = [
    {name:"AI",score:0.91},
    {name:"Defense",score:0.76},
    {name:"Obesity",score:0.84},
    {name:"Clean Energy",score:0.42}
  ]

  return (
    <div style={{marginTop:40}}>

      <h2>Momentum Heatmap</h2>

      {themes.map((t,i)=>(
        <div key={i} style={{
          display:"flex",
          alignItems:"center",
          marginTop:10
        }}>

          <div style={{width:120}}>
            {t.name}
          </div>

          <div style={{
            background:"black",
            height:10,
            width:t.score*300
          }}/>

        </div>
      ))}

    </div>
  )
}