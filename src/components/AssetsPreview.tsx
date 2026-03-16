export default function AssetsPreview() {

  const assets = [
    {symbol:"NVDA",theme:"AI"},
    {symbol:"LLY",theme:"Obesity"},
    {symbol:"XLE",theme:"Energy"},
    {symbol:"LMT",theme:"Defense"}
  ]

  return (
    <section style={{
      maxWidth:1100,
      margin:"80px auto"
    }}>

      <h2>Asset Discovery</h2>

      <table style={{
        width:"100%",
        marginTop:20
      }}>
        <thead>
          <tr>
            <th align="left">Asset</th>
            <th align="left">Theme</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((a,i)=>(
            <tr key={i}>
              <td>{a.symbol}</td>
              <td>{a.theme}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </section>
  )
}