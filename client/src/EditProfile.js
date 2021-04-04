import react, { useState } from "react";
import { 
  Avatar,
  Button,
  Dialog,
  DialogActions, 
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  profileImage: {
    height: theme.spacing(20),
    width: theme.spacing(20)
  },
  input: {
    display: "none"
  }

}));

const formFields = {
  file: "file",
  bio: "bio",
  city: "city",
  country: "country",
  url: "url",
  urlName: "urlName"
}



function EditProfile({profileUser}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldVals, setFieldVals] = useState({
    bio: profileUser.bio,
    city: profileUser.city,
    country: profileUser.country,
    links: [profileUser.links]
  });

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();

    Object.entries(formFields).forEach(([_, fieldName]) => {
      const val = fieldVals[fieldName];
      formData.append(fieldName, val);
    });
    console.log(formData.get("bio"), formData.get("city"));
    setOpen(false);
  }

  const onChangeField = (fieldName, value) => {
    // setErrorMessage("");
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

    setFieldVals((vals) => {
      return {
        ...vals,
      file: file
    };
    });
  };

  return (
    <div>
      <Button 
        variant="outlined" 
        onClick={handleClickOpen}
        size="small"
      >
        Edit Profile
      </Button>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="form-dialog-title">Edit your profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please take a couple seconds to fill out your profile details.
          </DialogContentText>
          <form
            encType="multipart/form-data"
            disabled={isLoading}
          >
          <Avatar
            alt="random"
            src={"https://picsum.photos/250/250"}
            className={classes.profileImage}
          >
          </Avatar>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            type="file"
            name="file"
            onChange={onProfileImageChange}
          />
          <label htmlFor="contained-button-file">
            <Button
              color="primary"
              component="span"
            >
              Change Profile Photo
            </Button>
          </label>
          <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField 
              id="bio" 
              label="Bio" 
              type="text" 
              multiline 
              fullWidth
              value={fieldVals.bio}
              onChange={(e) => onChangeField(formFields.bio, e.target.value)}
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
              value={fieldVals.city}
              onChange={(e) => onChangeField(formFields.city, e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              id="country"
              label="Country"
              type="text"
              value={fieldVals.country}
              onChange={(e) => onChangeField(formFields.country, e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              id="website"
              label="Website"
              type="url"
              value={fieldVals.links.url}
              onChange={(e) => onChangeField(formFields.url, e.target.value)}
            />
            <TextField
              id="website-name"
              label="Website Name"
              type="text"
              value={fieldVals.urlName}
              onChange={(e) => onChangeField(formFields.urlName, e.target.value)}
            />
          </Grid>
        </Grid>
        </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" type="submit">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditProfile;