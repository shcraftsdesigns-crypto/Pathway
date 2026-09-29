export default function StudyAreaCard({ title }: { title: string }) {
  return (
    <div className="card border-dashed">
      <h3 className="text-lg">{title}</h3>
      <p className="text-sm text-mute">Study content coming in a later phase.</p>
    </div>
  )
}
