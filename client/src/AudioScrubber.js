import React, { useRef } from "react";

import styles from "./AudioScrubber.module.css";

const scrubEventTypes = {
  touch: "touch",
  mouse: "mouse",
};

export default function AudioScrubber({ duration, currentTime, onTimeUpdate }) {
  const currentProgress = (currentTime / duration) * 100;
  const scrubberEl = useRef(null);

  function formatTime(time) {
    if (isNaN(time)) return "00:00";
    return new Date(time * 1000).toISOString().substr(14, 5);
  }

  function getTimeFromEvent(e) {
    const clickPositionInPage = e.pageX;
    const barStart =
      scrubberEl.current.getBoundingClientRect().left + window.scrollX;
    const barWidth = scrubberEl.current.offsetWidth;
    const clickPositionInBar = clickPositionInPage - barStart;
    const timePerPixel = duration / barWidth;
    return timePerPixel * clickPositionInBar;
  }

  function onScrub(e, eventType) {
    onTimeUpdate(getTimeFromEvent(e));

    const updateTimeOnMove = (eMove) => {
      onTimeUpdate(getTimeFromEvent(eMove));
    };

    if (eventType === scrubEventTypes.mouse) {
      document.addEventListener("mousemove", updateTimeOnMove);

      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", updateTimeOnMove);
      });
    } else if (eventType === scrubEventTypes.touch) {
      document.addEventListener("touchmove", updateTimeOnMove);

      document.addEventListener("touchend", () => {
        document.removeEventListener("touchmove", updateTimeOnMove);
      });
    }
  }

  return (
    <div className={styles.AudioScrubber}>
      <div
        ref={scrubberEl}
        className={styles.AudioScrubberProgress}
        style={{
          background: `linear-gradient(to right, #303f9f ${currentProgress}%, #d3d3d3 0)`,
        }}
        onMouseDown={(e) => onScrub(e, scrubEventTypes.mouse)}
        onTouchStart={(e) => onScrub(e, scrubEventTypes.touch)}
      >
        <span
          className={styles.AudioScrubberKnob}
          style={{ left: `${currentProgress}%` }}
        />
      </div>
      <div className={styles.AudioScrubberTime}>{formatTime(currentTime)}</div>
    </div>
  );
}
