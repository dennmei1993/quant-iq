export default function Panel({
  title,
  children
}:{
  title:string
  children:React.ReactNode
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">

      <h2 className="font-semibold mb-3">
        {title}
      </h2>

      {children}

    </div>
  )
}