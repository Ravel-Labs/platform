import AudioPlayer from './AudioPlayer';
import FeedbackPromptForm from './FeedbackPromptForm';

function TrackDisplay({ track }) {

  return (
    <div>
      <h1>{track ? track.title : `Fetching ${track?.slug || "track"}...`}</h1>
      {track && (
        <div>
          <div>slug: {track.slug}</div>
          <AudioPlayer track={track}/>
          {track.prompts.map((prompt) => (
            <FeedbackPromptForm key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TrackDisplay;