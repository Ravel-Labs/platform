import axios from "axios";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Input,
  InputLabel,
  ListItemText,
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
  "Hip-hop & Rap",
  "House",
  "Indie",
  "Jazz",
  "Latin",
  "Metal",
  "Pop",
  "R&B",
  "Reggae",
  "Reggaeton",
  "Rock",
  "Singer-Songwriter",
  "Soul",
  "Soundtrack",
  "Techno",
  "Trance",
  "Trap",
  "Triphop",
  "World",
];

const formFields = {
  audio: "audio",
  description: "description",
  genre: "genre",
  isPrivate: "isPrivate",
  prompts: "prompts",
  title: "title",
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function TrackUploadForm() {
  const classes = useFormStyles();
  const [fieldVals, setFieldVals] = useState({
    description: "",
    genre: "",
    isPrivate: false,
    prompts: [],
    title: "",
  });
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newTrack, setNewTrack] = useState("");
  const [promptOptions, setPromptOptions] = useState([]);

  useEffect(() => {
    async function fetchPrompts() {
      try {
        const res = await axios.get("/api/prompts");
        setPromptOptions(res.data);
      } catch (err) {
        console.error("failed fetching track", err);
      }
    }
    fetchPrompts();
  }, []);

  const onFormSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage("");
    const formData = new FormData();

    Object.entries(formFields).forEach(([_, fieldName]) => {
      const val = fieldVals[fieldName];
      if (Array.isArray(val)) {
        val.forEach((v) => formData.append(fieldName, v));
      } else {
        formData.append(fieldName, val);
      }
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

  const onChangeField = (fieldName, value) => {
    setErrorMessage("");
    setFieldVals((vals) => {
      return {
        ...vals,
        [fieldName]: value,
      };
    });
  };

  const onChangeSelectedPompts = (event) => {
    setFieldVals((vals) => {
      return {
        ...vals,
        prompts: [].concat(event.target.value),
      };
    });
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
          <InputLabel id="genre-select-label" required>
            Genre
          </InputLabel>
          <Select
            fullWidth
            required
            labelId="genre-select-label"
            id="genre-select"
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

        {/* Prompts */}
        <FormControl className={classes.formControl}>
          <InputLabel id="multiple-prompt-select">Prompts</InputLabel>
          <Select
            fullWidth
            labelId="multiple-prompt-select"
            id="demo-mutiple-checkbox"
            multiple
            value={fieldVals.prompts}
            onChange={onChangeSelectedPompts}
            input={<Input />}
            renderValue={(selected) => {
              if (selected.length > 0) {
                return `(${selected.length} selected)`;
              }
              return "";
            }}
            MenuProps={MenuProps}
          >
            {promptOptions.map((prompt) => (
              <MenuItem key={prompt.id} value={prompt.id}>
                <Checkbox checked={fieldVals.prompts.includes(prompt.id)} />
                <ListItemText primary={prompt.prompt} />
              </MenuItem>
            ))}
          </Select>
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
