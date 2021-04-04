import react from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from '@material-ui/core/Typography';
import { Grid, Avatar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  trackImage: {
    height: theme.spacing(20),
    width: theme.spacing(20)
  }

}))

function TrackItem({track, user}) {
  const history = useHistory();
  const classes = useStyles();

  const onClickTrack = (slug) => {
    history.push(`/track/${slug}`);
  }

  const onClickArtist = (user) => {
    console.log(user);
    history.push(`/${user.username}`);
  }
  
  return (
    <Grid item xs={3}>
        <Avatar 
          alt="random" 
          src="https://picsum.photos/250/250" 
          variant="square"
          className={classes.trackImage}
          onClick={() => onClickTrack(track.slug)}
        >
        </Avatar>
        <Typography 
          component="h1" 
          variant="body2" 
          align="left"
          onClick={() => onClickTrack(track.slug)}
        >
          {track.title}
        </Typography>
        <Typography 
          component="h1" 
          variant="body2" 
          align="left"
          onClick={() => onClickArtist(user)} 
        >
          {track.artist}
        </Typography>
    </Grid>
  );
};

export default TrackItem;