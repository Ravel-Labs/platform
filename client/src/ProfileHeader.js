import react from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import EditProfile from "./EditProfile";

const useStyles = makeStyles((theme) => ({
  userInfoPaper: {
    height: "250px",
  },
  profileImage: {
    height: theme.spacing(15),
    width: theme.spacing(15),
  },
  gridTextDisplay: {
    display: "flex",
    alignItems: "flex",
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  Box: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
}));

function ProfileHeader({ profileUser, tracks, profileStats }) {
  const classes = useStyles();
  return (
    <Box mx={30}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={3}>
          <Avatar
            alt="random"
            src="https://picsum.photos/250/250"
            className={classes.profileImage}
          ></Avatar>
        </Grid>
        <Grid item xs={3} className={classes.gridTextDisplay}>
          <Typography component="h2" variant="h5" className={classes.text}>
            {tracks.length} tracks
          </Typography>
        </Grid>
        <Grid item xs={3} className={classes.gridTextDisplay}>
          <Typography component="h2" variant="h5" className={classes.text}>
            {profileStats.feedbackCount} ratings
          </Typography>
        </Grid>
        <Grid item xs={3} className={classes.gridTextDisplay}>
          {profileStats.feedbackCount > 0 ? (
            <Typography component="h2" variant="h5" className={classes.text}>
              {profileStats.avgRating} rating
            </Typography>
          ) : (
            <>
              <Typography component="h2" variant="h5" className={classes.text}>
                no rating, yet
              </Typography>
            </>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography component="h2" variant="h4" align="left">
            {profileUser.displayName}
          </Typography>
          <Typography component="h3" variant="h5" align="left">
            {profileUser.username}
          </Typography>
          <Typography component="h3" variant="h5" align="left">
            Location
          </Typography>
          {profileUser.bio ? (
            <>{profileUser.bio}</>
          ) : (
            <>
              <Typography component="h1" variant="body2" align="left">
                I'm a real one and an early supporter of Ravel, but I don't have
                a bio, yet. It's on the way!
              </Typography>
            </>
          )}
          <Typography component="h1" variant="body1" align="left">
            Links
          </Typography>
          <Box component="span" className={classes.Box}>
            {/*<Button variant="outlined">Edit Profile</Button>*/}
            <EditProfile profileUser={profileUser} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfileHeader;
