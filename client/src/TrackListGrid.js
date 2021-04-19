import { useState } from "react";
import { Box, Grid } from "@material-ui/core";

import TrackItem from "./TrackItem";
import ConfirmDialog from "./ConfirmDialog";

export default function TrackListGrid({ tracks, onDeleteTrack }) {
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
    <Box display="flex" alignItems="center">
      <Grid container alignItems="center">
        {tracks.map((track) => {
          return (
            <TrackItem
              key={track.id}
              track={track}
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
  );
}
