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
  FormHelperText,
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
  artwork: "artwork",
  description: "description",
  genre: "genre",
  isPrivate: "isPrivate",
  prompts: "prompts",
  title: "title",
};

const imageHeight = 48;
const itemPaddingTop = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: imageHeight * 4.5 + itemPaddingTop,
      width: 250,
    },
  },
};

// TODO: move this into its own file.
const FileInputFormControl = ({
  accept,
  buttonText,
  inputFieldName,
  fileName,
  inputId,
  label,
  onChange,
}) => {
  const classes = useFormStyles();
  return (
    <FormControl className={classes.formControl} margin="normal">
      <FormGroup>
        <input
          hidden
          onChange={onChange}
          accept={accept}
          id={inputId}
          name={inputFieldName}
          style={{ display: "none" }}
          type="file"
        />
        <TextField
          required
          placeholder="No file chosen"
          label={label}
          value={fileName}
          InputProps={{
            readOnly: true,
          }}
          name="filename"
          type="text"
        />
        <label htmlFor={inputId} className={classes.fileInputTrigger}>
          <Button
            fullWidth
            component="span"
            variant="outlined"
            color="primary"
            startIcon={<CloudUpload />}
          >
            {buttonText}
          </Button>
        </label>
      </FormGroup>
    </FormControl>
  );
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
  const [audioFileName, setAudioFileName] = useState("");
  const [artworkFileName, setArtworkFileName] = useState("");
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

  const onChangeSelectedPrompts = (event) => {
    setFieldVals((vals) => {
      return {
        ...vals,
        prompts: [].concat(event.target.value),
      };
    });
  };

  const handleFileChange = (file, setFileName, fileFieldName) => {
    if (!file) {
      console.warn("no file selected");
      return;
    }

    setFileName(file.name);
    setFieldVals((vals) => {
      return {
        ...vals,
        [fileFieldName]: file,
      };
    });
  };

  const onAudioFileChange = async (e) => {
    handleFileChange(e.target.files[0], setAudioFileName, formFields.audio);
  };

  const onArtworkFileChange = async (e) => {
    handleFileChange(e.target.files[0], setArtworkFileName, formFields.artwork);
  };

  return (
    <Container component="main" maxWidth="xs">
      {newTrack && <Redirect to={`/track/${newTrack.slug}`} />}
      <Typography component="h1" variant="h4">
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
        <FileInputFormControl
          accept="audio/*"
          buttonText="Choose audio file"
          inputFieldName={formFields.audio}
          fileName={audioFileName}
          inputId="audio-file"
          label="Audio file"
          onChange={onAudioFileChange}
        />

        {/* Track artwork */}
        <FileInputFormControl
          accept="image/*"
          buttonText="Choose image"
          inputFieldName={formFields.artwork}
          fileName={artworkFileName}
          inputId="artwork-file"
          label="Track artwork"
          onChange={onArtworkFileChange}
        />

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
          helperText="What do you want listeners to know about this track?"
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
          <FormHelperText>
            Private tracks are only visible to users you have invited to Ravel.
          </FormHelperText>
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
            onChange={onChangeSelectedPrompts}
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
              <MenuItem
                key={prompt.id}
                value={prompt.id}
                className={classes.menuItem}
              >
                <Checkbox checked={fieldVals.prompts.includes(prompt.id)} />
                <ListItemText primary={prompt.prompt} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            What would you like to learn from listeners?
          </FormHelperText>
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
