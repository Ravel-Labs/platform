import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Box, Grid, Avatar } from "@material-ui/core";
import { Lock, Delete, PlayCircleFilled } from "@material-ui/icons";

import { UserContext } from "./Context";
import placeholderImage from "./images/placeholder_image.png";

const useStyles = makeStyles((theme) => ({
  item: {
    marginRight: "24px",
  },
  trackImageWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  trackImage: {
    height: theme.spacing(20),
    width: theme.spacing(20),
    [theme.breakpoints.up("md")]: {
      height: theme.spacing(25),
      width: theme.spacing(25),
    },
    margin: 0,
  },
  trackImageOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    height: "100%",
    width: "100%",
    opacity: 0,
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
    },
  },
  overlaySquareOuterWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  overlayCircleInnerWrapper: {
    backgroundColor: "white",
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayIcon: {
    display: "flex",
    fontSize: "80px",
    color: "#303f9f",
  },
  title: {
    fontWeight: 700,
    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
  artist: {
    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
  delete: {
    cursor: "pointer",
  },
}));

function TrackItem({ track, shouldShowDelete, onClickDelete }) {
  const history = useHistory();
  const classes = useStyles();
  const { user } = useContext(UserContext);
  // TODO: Remove.
  const trackImage = track.imagePath || placeholderImage;

  const onClickTrack = (slug) => {
    history.push(`/track/${slug}`);
  };

  const onClickArtist = (artistUsername) => {
    history.push(`/${artistUsername}`);
  };

  return (
    <Grid item className={classes.item}>
      <Box
        className={classes.trackImageWrapper}
        onClick={() => onClickTrack(track.slug)}
      >
        <Avatar
          alt="random"
          src={trackImage}
          variant="square"
          className={classes.trackImage}
        ></Avatar>
        <Box className={classes.trackImageOverlay}>
          <div className={classes.overlaySquareOuterWrapper}>
            <div className={classes.overlayCircleInnerWrapper}>
              <PlayCircleFilled className={classes.overlayIcon} />
            </div>
          </div>
        </Box>
      </Box>
      <div>
        <Grid container justify="space-between">
          <Grid item>
            <Grid container onClick={() => onClickTrack(track.slug)}>
              <Grid item>
                {track.isPrivate && <Lock alt="Private" fontSize="small" />}
              </Grid>
              <Grid item>
                <Typography
                  variant="body1"
                  align="left"
                  className={classes.title}
                >
                  {track.title}
                </Typography>
              </Grid>
            </Grid>
            <Typography
              variant="body2"
              align="left"
              className={classes.artist}
              onClick={() => onClickArtist(track.username)}
            >
              {track.artist}
            </Typography>
          </Grid>
          {shouldShowDelete && user && user.username === track.username && (
            <Grid item className={classes.delete} onClick={onClickDelete}>
              <Delete alt="Delete" fontSize="small" />
            </Grid>
          )}
        </Grid>
      </div>
    </Grid>
  );
}

export default TrackItem;
