import axios from 'axios';

export default function TrackUploadForm() {
  const onSubmit = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.warn("no file selected")
      return
    }

    const formData = new FormData();
    formData.append("name", "test track");
    formData.append("audio", file);
    await axios.post("/tracks", formData)
  }

  return (
    <form encType="multipart/form-data">
      <input type="file" name="audio" accept="audio/*" onChange={onSubmit} />
    </form>
  )
}