import axios from 'axios';
import {useState} from 'react';


export default function TrackUploadForm() {
  const [genre, setGenre] = useState("");

  const onSubmit = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.warn("no file selected")
      return
    }

    const formData = new FormData();
    formData.append("name", "test track");
    formData.append("audio", file);
    await axios.post("/api/tracks", formData)
  }

  return (
    <form encType="multipart/form-data">
      <label>
        Genre
        <input type="text" name="genre" value={genre} onChange={e => setGenre(e.target.value)}/>
      </label>
      <input type="file" name="audio" accept="audio/*" onChange={onSubmit} />
    </form>
  )
}