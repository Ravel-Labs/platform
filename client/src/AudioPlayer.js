import { useRef, useState } from "react";
import { Typography } from "@material-ui/core";
import { PlayCircleFilled, PauseCircleFilled } from "@material-ui/icons";
import axios from "axios";
import debounce from "lodash.debounce";

import AudioScrubber from "./AudioScrubber";
import useAudioPlayer from "./useAudioPlayer";

import styles from "./AudioPlayer.module.css";

// TODO: Share these with the backend.
const playbackEventTypes = {
  play: "PLAY",
  pause: "PAUSE",
  playEnded: "PLAY_ENDED",
  seek: "SEEK",
};

// 15 mins
const sessionExpirationTimeMs = 15 * 60 * 1000;

export default function AudioPlayer({ track }) {
  let eventTimeDiff;
  const nowMs = Date.now();
  const [sessionId, setSessionId] = useState(null);
  const [shouldCreateNewSession, setShouldCreateNewSession] = useState(true);
  const [lastEventTime, setLastEventTime] = useState(null);

  const {
    currentTime,
    duration,
    isPlaying,
    setIsPlaying,
    setClickedTime,
  } = useAudioPlayer(track?.slug);

  const sendAnalytics = async (payload) => {
    if (sessionId === null) {
      setLastEventTime(nowMs);
      setShouldCreateNewSession(!shouldCreateNewSession);
    } else {
      eventTimeDiff = nowMs - lastEventTime;
      setLastEventTime(nowMs);
      if (eventTimeDiff > sessionExpirationTimeMs) {
        setShouldCreateNewSession(!shouldCreateNewSession);
        setLastEventTime(nowMs);
        console.log(shouldCreateNewSession);
      }
    }

    payload.trackSlug = track.slug;
    payload.trackId = track.id;
    payload.shouldCreateNewSession = shouldCreateNewSession;
    payload.sessionId = sessionId;
    const res = await axios.post("/api/analytics", payload);
    setSessionId(res.data.sessionId);
  };

  const onClickPlay = (e) => {
    setIsPlaying(true);
    sendAnalytics({
      eventType: playbackEventTypes.play,
      eventData: {
        currentTime,
      },
    });
  };

  const onClickPause = (e) => {
    setIsPlaying(false);
    sendAnalytics({
      eventType: playbackEventTypes.pause,
      eventData: {
        currentTime,
      },
    });
  };

  const onPlayEnded = (e) => {
    setIsPlaying(false);
    sendAnalytics({
      eventType: playbackEventTypes.playEnded,
      eventData: {
        currentTime,
      },
    });
  };

  const onSeekComplete = (e) => {
    sendAnalytics({
      eventType: playbackEventTypes.seek,
      eventData: {
        currentTime: e.target.currentTime,
      },
    });
  };

  const onSeekCompleteRef = useRef(debounce(onSeekComplete, 1000));

  return (
    <div className={styles.AudioPlayer}>
      <audio
        id={track?.slug}
        src={track?.path}
        preload="metadata"
        onEnded={onPlayEnded}
        onSeeked={onSeekCompleteRef.current}
      />
      <div className={styles.PlayerControls}>
        <div className={styles.PlayPause}>
          {isPlaying ? (
            <PauseCircleFilled onClick={onClickPause} />
          ) : (
            <PlayCircleFilled onClick={onClickPlay} />
          )}
        </div>
        <div className={styles.TrackInfo}>
          <Typography
            variant="h2"
            component="h1"
            className={styles.TrackInfoTitle}
          >
            {track.title}
          </Typography>
          {track.artist && (
            <Typography
              variant="h2"
              component="h1"
              className={styles.TrackInfoArtist}
            >
              {track.artist}
            </Typography>
          )}
        </div>
        <AudioScrubber
          currentTime={currentTime}
          duration={duration}
          onTimeUpdate={(time) => setClickedTime(time)}
        />
      </div>
    </div>
  );
}
