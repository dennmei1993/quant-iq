export default function ThemeCard({ theme }: any) {

  return (
    <div className="border rounded-lg p-4 shadow">

      <h2 className="text-lg font-semibold">
        {theme.theme_name}
      </h2>

      <p className="text-green-600">
        {theme.return_21d?.toFixed(2)}%
      </p>

    </div>
  )
}