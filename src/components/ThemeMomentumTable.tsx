export default function ThemeMomentumTable() {

  const themes = [
    {name:"Artificial Intelligence",score:0.91,change:"+0.07"},
    {name:"Obesity Drugs",score:0.84,change:"+0.03"},
    {name:"Defense Spending",score:0.76,change:"+0.05"},
    {name:"Clean Energy",score:0.42,change:"-0.04"},
  ]

  return (
    <table style={{width:"100%", marginTop:30}}>

      <thead>
        <tr>
          <th align="left">Theme</th>
          <th align="left">Momentum</th>
          <th align="left">7d Change</th>
        </tr>
      </thead>

      <tbody>
        {themes.map((t,i)=>(
          <tr key={i}>
            <td>{t.name}</td>
            <td>{t.score}</td>
            <td>{t.change}</td>
          </tr>
        ))}
      </tbody>

    </table>
  )
}