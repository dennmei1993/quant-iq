export default function AssetThemes({ themes }: any) {

  return (
    <div>

      <h3 className="font-semibold mb-2">
        Theme Exposure
      </h3>

      {themes.map((t: any) => (
        <div key={t.theme_name} className="mb-1">
          {t.theme_name}
        </div>
      ))}

    </div>
  )
}