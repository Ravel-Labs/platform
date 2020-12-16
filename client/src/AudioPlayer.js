const audioSource = "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3";

export default function AudioPlayer() {
  return (
    <div>
      <audio src={audioSource} controls preload="metadata" />
    </div>
  )
}