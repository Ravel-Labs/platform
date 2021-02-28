import AudioPlayer from './AudioPlayer';
import FeedbackPromptForm from './FeedbackPromptForm';

function TrackDisplay({ track }) {
  return (
    <div>
      {track && (
        <div>
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