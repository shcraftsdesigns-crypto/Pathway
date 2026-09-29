export default function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return <p role="status" className="py-12 text-center text-mute">{label}</p>
}
