import { useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

export default function Waveform() {
  const path =
    "http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3";
  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: "#wave",
      scrollParent: true,
      cursorWidth: 6,
      waveColor: "lightBlue",
      progressColor: "blue",
      loopSelection: true,
    });
    wavesurfer.load(path);
  }, [path]);

  return (
    <div>
      <div id="wave"></div>
    </div>
  );
}
