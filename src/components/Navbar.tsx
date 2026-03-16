export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "18px 40px",
      borderBottom: "1px solid #eee",
      background: "white"
    }}>

      <div style={{fontWeight:700,fontSize:20}}>
        Quant IQ
      </div>

      <div style={{display:"flex",gap:24}}>
        <a href="/themes">Themes</a>
        <a href="/macro">Macro</a>
        <a href="/assets">Assets</a>
        <a href="/signals">Signals</a>
        <a href="/dashboard">Dashboard</a>
      </div>

    </nav>
  )
}