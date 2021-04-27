import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Avatar, Button, Link } from "@material-ui/core";
import { Edit, Link as LinkIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

import placeholderProfileImage from "./placeholder_profile.png";

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "750px",
    margin: "0 auto",
  },
  userInfoPaper: {
    height: "250px",
  },
  bio: {
    margin: "12px 0",
  },
  profileImage: {
    height: theme.spacing(15),
    width: theme.spacing(15),
  },
  profileFieldContainer: {
    textAlign: "left",
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
  link: {
    display: "flex",
    alignItems: "center",
  },
  linkText: {
    marginLeft: "6px",
  },
  editButton: {
    marginTop: "20px",
  },
}));

function ProfileHeader({
  profileUser,
  tracks,
  profileStats,
  onClickEdit,
  hasEditPriviledges,
}) {
  const classes = useStyles();
  const hasStats =
    profileStats.feedbackCount > 0 || !isNaN(profileStats.avgRating);
  let locationDisplay = profileUser?.city || "";
  if (locationDisplay.length && profileUser?.country) {
    locationDisplay += `, ${profileUser.country}`;
  } else if (profileUser?.country) {
    locationDisplay = profileUser?.country;
  }

  return (
    <Box className={classes.container}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={3}>
          <Avatar
            alt="random"
            src={profileUser.imagePath || placeholderProfileImage}
            className={classes.profileImage}
          ></Avatar>
        </Grid>
        {hasStats && (
          <>
            <Grid item xs={3} className={classes.gridTextDisplay}>
              <Typography variant="h5" className={classes.text}>
                {tracks.length} {tracks > 1 ? "tracks" : "track"}
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.gridTextDisplay}>
              <Typography variant="h5" className={classes.text}>
                {profileStats.feedbackCount} ratings
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.gridTextDisplay}>
              {profileStats.feedbackCount > 0 ? (
                <Typography variant="h5" className={classes.text}>
                  {profileStats.avgRating} rating
                </Typography>
              ) : (
                <>
                  <Typography variant="h5" className={classes.text}>
                    no rating, yet
                  </Typography>
                </>
              )}
            </Grid>
          </>
        )}
        <Grid item xs={12} className={classes.profileFieldContainer}>
          <Typography component="h2" variant="h4">
            {profileUser.displayName}
          </Typography>
          <Typography variant="body2">
            Joined {new Date(profileUser.createdAt).toLocaleDateString()}
          </Typography>
          {locationDisplay && (
            <Typography variant="body2">
              {profileUser.city}, {profileUser.country}
            </Typography>
          )}
          {profileUser.bio && (
            <Typography variant="body1" className={classes.bio}>
              {profileUser.bio}
            </Typography>
          )}
          {profileUser.link && (
            <Grid container direction="row" alignItems="center">
              <Link href={profileUser.link.url} className={classes.link}>
                <LinkIcon />
                <span className={classes.linkText}>{profileUser.link.url}</span>
              </Link>
            </Grid>
          )}
        </Grid>
      </Grid>
      {hasEditPriviledges && (
        <Button
          className={classes.editButton}
          variant="outlined"
          onClick={onClickEdit}
          size="small"
          startIcon={<Edit />}
        >
          Edit Profile
        </Button>
      )}
    </Box>
  );
}

export default ProfileHeader;
