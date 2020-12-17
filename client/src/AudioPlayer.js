export default function AudioPlayer({ url }) {
  return (
    <div>
      <audio src={url} controls preload="metadata" />
    </div>
  )
}