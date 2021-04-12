import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import placeholderProfileImage from "./placeholder_profile.png";

const useStyles = makeStyles((theme) => ({
  profileImage: {
    height: theme.spacing(20),
    width: theme.spacing(20),
  },
  input: {
    display: "none",
  },
  editContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  profileImageFormGroup: {
    paddingBottom: "24px",
  },
}));

const formFields = {
  file: "file",
  bio: "bio",
  city: "city",
  country: "country",
  link: "link",
};

function EditProfile({
  errorMessage,
  isDisabled,
  isOpen,
  onClose,
  onSubmit,
  profileUser,
}) {
  const classes = useStyles();
  const [newImageDataUrl, setNewImageDataUrl] = useState(null);
  const [fieldVals, setFieldVals] = useState({
    bio: profileUser.bio || "",
    city: profileUser.city || "",
    country: profileUser.country || "",
    link: profileUser.link?.url || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(formFields).forEach(([_, fieldName]) => {
      const val = fieldVals[fieldName];
      formData.append(fieldName, val);
    });

    onSubmit(formData);
  };

  const onChangeField = (fieldName, value) => {
    setFieldVals((vals) => {
      return {
        ...vals,
        [fieldName]: value,
      };
    });
  };

  const onProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.warn("no file selected");
      return;
    }

    // Read the file so we can show the preview url.
    var reader = new FileReader();
    reader.onload = function (e) {
      setNewImageDataUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    setFieldVals((vals) => {
      return {
        ...vals,
        file: file,
      };
    });
  };

  return (
    <Box className={classes.editContainer}>
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="form-dialog-title">Edit your profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please take a couple seconds to fill out your profile details.
          </DialogContentText>
          <form encType="multipart/form-data" disabled={isDisabled}>
            <div className={classes.profileImageFormGroup}>
              <Avatar
                alt="random"
                src={
                  newImageDataUrl ||
                  profileUser.imagePath ||
                  placeholderProfileImage
                }
                className={classes.profileImage}
              ></Avatar>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                type="file"
                name="file"
                onChange={onProfileImageChange}
              />
              <label htmlFor="contained-button-file">
                <Button color="primary" component="span" startIcon={<Edit />}>
                  Change Photo
                </Button>
              </label>
            </div>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  id="bio"
                  label="Bio"
                  type="text"
                  multiline
                  fullWidth
                  value={fieldVals.bio || ""}
                  onChange={(e) =>
                    onChangeField(formFields.bio, e.target.value)
                  }
                  variant="outlined"
                  rows="5"
                  rowsMax="10"
                />
              </Grid>
              <Grid item>
                <TextField
                  id="city"
                  label="City"
                  type="text"
                  value={fieldVals.city || ""}
                  onChange={(e) =>
                    onChangeField(formFields.city, e.target.value)
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  id="country"
                  label="Country"
                  type="text"
                  value={fieldVals.country || ""}
                  onChange={(e) =>
                    onChangeField(formFields.country, e.target.value)
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  id="link"
                  label="Link"
                  type="url"
                  value={fieldVals.link}
                  onChange={(e) =>
                    onChangeField(formFields.link, e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </form>
          {errorMessage && <Box color="error.main">{errorMessage}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" type="submit">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditProfile;
