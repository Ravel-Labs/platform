import { useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

// TODO: Share these with the backend.
const playbackEventTypes = {
  play: "PLAY",
  pause: "PAUSE",
  playEnded: "PLAY_ENDED",
  seek: "SEEK",
}

const sessionExpirationTime = 15*60*1000

export default function AudioPlayer({ track }) {
  let eventTimeDiff;
  const nowMs = Date.now()  
  const [sessionId, setSessionId] = useState(null)
  const [newSession, setNewSession] = useState(true)
  const [lastEventTime, setLastEventTime] = useState(null)


  const sendAnalytics = async (payload) => {
    if (sessionId === null) {
      setLastEventTime(nowMs)
      setNewSession(!newSession)
    } else {
      eventTimeDiff = nowMs - lastEventTime
      setLastEventTime(nowMs)
      if(eventTimeDiff > sessionExpirationTime) {
        setNewSession(!newSession)
        setLastEventTime(nowMs)
        console.log(newSession)
      }
    }

    payload.trackSlug = track.slug;
    payload.trackId = track.id;
    payload.newSession = newSession;
    payload.sessionId = sessionId
    const res = await axios.post("/api/analytics", payload)
    setSessionId(res.data.sessionId)
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
        src={track?.path}
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