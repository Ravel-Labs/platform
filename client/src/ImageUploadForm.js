import axios from "axios";
import react, { useState, useEffect } from "react";
import Card from '@material-ui/core/Card';
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import blue from "@material-ui/core/colors/blue";
import { makeStyles } from "@material-ui/core/styles";
// import defaultImagePath from "./ravel_placeholder_image.png";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  button: {
    color: blue[900],
    margin: 10,
    // display: "flex",
    // justifyContent: "center",
  },
}));


export default function ImageUploadForm() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePath, setImagePath] = useState(null);
  const [isShown, setIsShown] = useState(false);

  // useEffect(() => {
  //   async function fetchImage() {
  //     try {
  //       const res = await axios.get("/api/profile-image");
  //       if (res) {
  //         setImagePath(res);
  //       }
  //     } catch(e) {
  //       console.error
  //     }
  //   }

  // }, [image])

  const onImageFileChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    if (!file) {
      console.warn("No file has been selected");
      return;
    }

    try {
      const res = await axios.post("/api/user/update-profile-image", formData);
      if (res.status === 201) {
        console.log("successful res: ", res.data);
      }
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <Card>
      <CardContent
        onMouseOver={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <Typography component="h5" variant="h5">
          Please upload a file
        </Typography>
        <Grid 
          container 
          justify="center" 
          alignItems="center"
        >
{/*        {imagePath ? 
          (<img alt="placeholder" src={imagePath} />) 
          :  (<img alt="placeholder" src={defaultImagePath} width="250" height="250" />)}*/}
          <form
            encType="multipart/form-data"
            disabled={isLoading}
          >
            <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              type="file"
              name="file"
              onChange={onImageFileChange}
            />
            {isShown && <label htmlFor="contained-button-file">
              <Fab component="span" className={classes.button}>
                <AddPhotoAlternateIcon />
              </Fab>
            </label>}
          </form>
        </Grid>
      </CardContent>
    </Card>
  );
}