import axios from 'axios';
import debounce from 'lodash.debounce';

// TODO: Share these with the backend.
const playbackEventTypes = {
  play: "PLAY",
  pause: "PAUSE",
  playEnded: "PLAY_ENDED",
  seek: "SEEK",
}

export default function AudioPlayer({ track }) {
  const sendAnalytics = async (payload) => {
    payload.trackSlug = track.slug;
    payload.trackId = track.id;
    await axios.post("/analytics", payload)
  }

  const onClickPlay = (e) => {
    sendAnalytics({
      eventType: playbackEventTypes.play,
      eventData: {
        currentTime: e.target.currentTime,
      },
    })
  }

  const onClickPause = (e) => {
    sendAnalytics({
      eventType: playbackEventTypes.pause,
      eventData: {
        currentTime: e.target.currentTime,
      },
    })
  }

  const onPlayEnded = (e) => {
    sendAnalytics({
      eventType: playbackEventTypes.playEnded,
      eventData: {
        currentTime: e.target.currentTime,
      }
    })
  }

  const onSeekComplete = (e) => {
    sendAnalytics({
      eventType: playbackEventTypes.seek,
      eventData: {
        currentTime: e.target.currentTime,
      },
    })
  }

  const debouncedOnSeekComplete = debounce(onSeekComplete, 100)

  return (
    <div>
      <audio
        src={track?.url}
        controls
        preload="metadata"
        onEnded={onPlayEnded}
        onPlay={onClickPlay}
        onPause={onClickPause}
        onSeeked={debouncedOnSeekComplete}
      />
    </div>
  )
}