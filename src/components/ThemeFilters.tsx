export default function ThemeFilters() {
  return (
    <div style={{
      display:"flex",
      gap:20,
      marginBottom:30
    }}>

      <select>
        <option>7 Days</option>
        <option>30 Days</option>
        <option>90 Days</option>
      </select>

      <select>
        <option>Global</option>
        <option>US</option>
        <option>Europe</option>
        <option>Asia</option>
      </select>

      <input placeholder="Search theme..." />

    </div>
  )
}