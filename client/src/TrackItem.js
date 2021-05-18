import classNames from "classnames";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Box, Grid, Avatar } from "@material-ui/core";
import { Lock, Delete, PlayCircleFilled } from "@material-ui/icons";

import { UserContext } from "./Context";
import placeholderImage from "./images/placeholder_image.png";

const useStyles = makeStyles((theme) => ({
  trackImageWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  trackImage: {
    // NOTE: These values need to be in sync with TrackListGrid.trackGridContainer column spacing.
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
    display: "inline-block",
    fontWeight: 700,
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
  titleRow: {
    whiteSpace: "nowrap",
    maxWidth: "100%",
    justifyContent: "space-between",
    textAlign: "left",
  },
  artist: {
    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
  delete: {
    cursor: "pointer",
    textAlign: "right",
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
    <Grid item className={classes.trackItem}>
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
      <Grid container justify="space-between">
        <Grid item container className={classes.titleRow}>
          <Grid
            item
            xs={10}
            className={classes.titleRowItem}
            onClick={() => onClickTrack(track.slug)}
          >
            {track.isPrivate && <Lock alt="Private" fontSize="small" />}
            <Typography variant="body1" align="left" className={classes.title}>
              {track.title}
            </Typography>
          </Grid>
          {shouldShowDelete && user && user.username === track.username && (
            <Grid
              item
              xs={2}
              className={classNames(classes.delete, classes.titleRowItem)}
              onClick={onClickDelete}
            >
              <Delete alt="Delete" fontSize="small" />
            </Grid>
          )}
        </Grid>
        <Grid item container className={classes.artistRow}>
          <Typography
            variant="body2"
            align="left"
            className={classes.artist}
            onClick={() => onClickArtist(track.username)}
          >
            {track.artist}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default TrackItem;
