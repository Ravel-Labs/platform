import { useState, useEffect } from "react";

export default function useAudioPlayer(elementId) {
  const [duration, setDuration] = useState();
  const [currentTime, setCurrentTime] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [clickedTime, setClickedTime] = useState();

  const updatePlayState = async (newIsPlaying) => {
    const audio = document.getElementById(elementId);
    if (!audio) {
      console.error("Unable to find audio element");
      return;
    }

    if (newIsPlaying) {
      await audio.play();
    } else {
      await audio.pause();
    }
    setIsPlaying(newIsPlaying);
  };

  useEffect(() => {
    const audio = document.getElementById(elementId);
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    // DOM listeners: update React state on DOM events
    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);

    if (clickedTime && clickedTime !== currentTime) {
      audio.currentTime = clickedTime;
      setClickedTime(null);
    }

    // effect cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, [currentTime, clickedTime, elementId, isPlaying]);

  return {
    currentTime,
    duration,
    isPlaying,
    setClickedTime,
    setIsPlaying: updatePlayState,
  };
}
