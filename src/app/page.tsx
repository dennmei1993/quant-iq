export default function Home() {
  return (
    <main style={{
      display: "flex",
      minHeight: "100vh",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{fontSize: "48px", fontWeight: "700"}}>
        Quant IQ
      </h1>

      <p style={{marginTop: "10px", color: "#666"}}>
        AI-powered market intelligence
      </p>
    </main>
  );
}