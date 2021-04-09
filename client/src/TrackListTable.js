import { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { DeleteOutline, Lock, LockOpen } from "@material-ui/icons";
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";

import ConfirmDialog from "./ConfirmDialog";

const useStyles = makeStyles({
  tableRow: {
    cursor: "pointer",
  },
  header: {
    textAlign: "left",
    paddingBottom: ".5em",
    paddingTop: "1em",
  },
});

export default function TrackListTable({
  title,
  tracks,
  onDeleteTrack = () => {},
  shouldShowPrivacy = false,
  shouldShowDelete = false,
  size = "small",
}) {
  const history = useHistory();
  const classes = useStyles();

  const [trackToDelete, setTrackToDelete] = useState(null);

  const onClickTrack = (slug) => {
    history.push(`/track/${slug}`);
  };

  const handleDeleteClickOpen = (e, track) => {
    e.stopPropagation();
    setTrackToDelete(track);
  };

  const onDeleteClose = (e) => {
    e.stopPropagation();
    setTrackToDelete(null);
  };

  const confirmDeleteTrack = async (e) => {
    e.stopPropagation();
    onDeleteTrack(trackToDelete.slug);
    setTrackToDelete(null);
  };

  return (
    <Box>
      <Typography variant="h5" component="h3" className={classes.header}>
        {title}
      </Typography>
      <TableContainer>
        <Table size={size}>
          <TableHead>
            <TableRow>
              {shouldShowPrivacy && <TableCell></TableCell>}
              <TableCell>Title</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Genre</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tracks.map((track) => (
              <TableRow
                hover
                className={classes.tableRow}
                key={track.id}
                onClick={() => onClickTrack(track.slug)}
              >
                {shouldShowPrivacy && (
                  <TableCell padding="checkbox">
                    {track.isPrivate ? (
                      <Lock alt="Private" />
                    ) : (
                      <LockOpen alt="Public" />
                    )}
                  </TableCell>
                )}
                <TableCell>{track.title}</TableCell>
                <TableCell>{track.artist}</TableCell>
                <TableCell>{track.genre}</TableCell>
                {shouldShowDelete && (
                  <TableCell padding="checkbox">
                    <DeleteOutline
                      onClick={(e) => {
                        handleDeleteClickOpen(e, track);
                      }}
                    />
                    <ConfirmDialog
                      title="Delete Track"
                      isOpen={Boolean(trackToDelete)}
                      onClose={onDeleteClose}
                      onConfirm={confirmDeleteTrack}
                    >
                      Are you sure that you want to delete this track?
                    </ConfirmDialog>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
