import axios from "axios";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";

import useFormStyles from "./useFormStyles";

const genres = [
  "Alternative Rock",
  "Ambient",
  "Blues",
  "Classical",
  "Country",
  "Dance & EDM",
  "Dancehall",
  "Deep House",
  "Disco",
  "Drum & Bass",
  "Dubstep",
  "Electronic",
  "Folk",
  "Singer-Songwriter",
  "Hip-hop & Rap",
  "House",
  "Indie",
  "Jazz",
  "Latin",
  "Metal",
  "Pop",
  "R&B",
  "Soul",
  "Reggae",
  "Reggaeton",
  "Rock",
  "Soundtrack",
  "Techno",
  "Trance",
  "Trap",
  "Triphop",
  "World",
];

const formFields = {
  title: "title",
  description: "description",
  audio: "audio",
  genre: "genre",
  isPrivate: "isPrivate",
};

export default function TrackUploadForm() {
  const classes = useFormStyles();
  const [fieldVals, setFieldVals] = useState({
    title: "",
    description: "",
    genre: "",
    isPrivate: false,
  });
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newTrack, setNewTrack] = useState("");

  const onChangeField = (fieldName, value) => {
    setErrorMessage("");
    setFieldVals((vals) => {
      return {
        ...vals,
        [fieldName]: value,
      };
    });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage("");
    const formData = new FormData();

    Object.entries(formFields).forEach(([_, fieldName]) => {
      formData.append(fieldName, fieldVals[fieldName]);
    });

    try {
      const res = await axios.post("/api/tracks", formData);
      if (res.status === 201) {
        setNewTrack(res.data);
      } else {
        setErrorMessage(res.data.errorMessage);
      }
    } catch (e) {
      setErrorMessage(
        e.response?.data?.errorMessage || "Error uploading track."
      );
    }
    setIsLoading(false);
  };

  const onAudioFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.warn("no file selected");
      return;
    }

    setFileName(file.name);
    setFieldVals((vals) => {
      return {
        ...vals,
        audio: file,
      };
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      {newTrack && <Redirect to={`/track/${newTrack.slug}`} />}
      <Typography component="h1" variant="h5">
        Upload
      </Typography>
      <form
        encType="multipart/form-data"
        className={classes.form}
        onSubmit={onFormSubmit}
        disabled={isLoading}
      >
        {/* Name */}
        <TextField
          fullWidth
          autoFocus
          required
          onChange={(e) => onChangeField(formFields.title, e.target.value)}
          value={fieldVals.name}
          label="Title"
          margin="normal"
          name={formFields.title}
          type="text"
        />

        {/* Audio file */}
        <FormControl className={classes.formControl} margin="normal">
          <FormGroup>
            <input
              hidden
              onChange={onAudioFileChange}
              accept="audio/*"
              id="audio-file"
              name={formFields.audio}
              style={{ display: "none" }}
              type="file"
            />
            <TextField
              required
              placeholder="No file chosen"
              label="File"
              value={fileName}
              InputProps={{
                readOnly: true,
              }}
              name="filename"
              type="text"
            />
            <label htmlFor="audio-file" className={classes.fileInputTrigger}>
              <Button
                fullWidth
                component="span"
                variant="outlined"
                color="primary"
                startIcon={<CloudUpload />}
              >
                Choose file
              </Button>
            </label>
          </FormGroup>
        </FormControl>

        {/* Genre */}
        <FormControl className={classes.formControl} margin="normal">
          <InputLabel id="genre-select" required>
            Genre
          </InputLabel>
          <Select
            fullWidth
            required
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={fieldVals.genre || ""}
            onChange={(e) => onChangeField(formFields.genre, e.target.value)}
            SelectDisplayProps={{ style: { textAlign: "left" } }}
          >
            <MenuItem value="">None</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre.toLowerCase()}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Description */}
        <TextField
          fullWidth
          multiline
          onChange={(e) =>
            onChangeField(formFields.description, e.target.value)
          }
          value={fieldVals.description}
          label="Description"
          margin="normal"
          name={formFields.description}
          type="text"
          helperText="Describe your track"
        />

        {/* Private */}
        <FormControl className={classes.formControl} margin="normal">
          <FormControlLabel
            control={
              <Checkbox
                value={fieldVals.isPrivate}
                onChange={(e) =>
                  onChangeField(formFields.isPrivate, e.target.checked)
                }
                name={formFields.isPrivate}
                color="primary"
              />
            }
            label="Private"
          />
        </FormControl>

        {/* Submit */}
        <Button
          fullWidth
          disabled={isLoading}
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Upload
        </Button>
        {errorMessage && <Box color="error.main">{errorMessage}</Box>}
        {isLoading && (
          <Box color="info.main">
            This might take a minute or two, hold tight!
          </Box>
        )}
      </form>
    </Container>
  );
}
