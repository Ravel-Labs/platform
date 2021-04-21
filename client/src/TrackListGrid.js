import { useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import TrackItem from "./TrackItem";
import ConfirmDialog from "./ConfirmDialog";

const useStyles = makeStyles({
  header: {
    textAlign: "left",
    paddingBottom: ".5em",
  },
});

export default function TrackListGrid({
  tracks,
  title,
  onDeleteTrack,
  shouldShowDelete = false,
}) {
  const classes = useStyles();
  const [selectedDeleteTrackSlug, setSelectedDeleteTrackSlug] = useState(null);
  const [shouldConfirmDelete, setShouldConfirmDelete] = useState(false);

  const handleDeleteClickOpen = (trackSlug) => {
    setShouldConfirmDelete(true);
    setSelectedDeleteTrackSlug(trackSlug);
    console.log("clicked delete button for track: ", trackSlug);
  };

  const onCloseConfirmDialog = () => {
    setShouldConfirmDelete(false);
    setSelectedDeleteTrackSlug(null);
  };

  const onConfirmDelete = async () => {
    await onDeleteTrack(selectedDeleteTrackSlug);
    setShouldConfirmDelete(false);
    setSelectedDeleteTrackSlug(null);
  };

  return (
    <div>
      <Typography variant="h5" component="h3" className={classes.header}>
        {title}
      </Typography>
      <Box display="flex" alignItems="center">
        <Grid container alignItems="center">
          {tracks.map((track) => {
            return (
              <TrackItem
                key={track.id}
                track={track}
                shouldShowDelete={shouldShowDelete}
                onClickDelete={() => handleDeleteClickOpen(track.slug)}
              />
            );
          })}
        </Grid>
        <ConfirmDialog
          title="Delete Track"
          isOpen={shouldConfirmDelete}
          onClose={onCloseConfirmDialog}
          onConfirm={onConfirmDelete}
        >
          Are you sure that you want to delete this track?
        </ConfirmDialog>
      </Box>
    </div>
  );
}
