import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Lock, LockOpen, DeleteOutline } from "@material-ui/icons";
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Grid,
} from "@material-ui/core";

import ConfirmDialog from "./ConfirmDialog";
import TrackItem from "./TrackItem";

/* 

NOTE: This is an in-progress component that will likely replace the exisitng track list 
component in certain places (e.g., Homepage). It's more of a grid view, inspired by soundcloud
and spotify.

*/

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
  setProfileTracks,
  user,
  shouldShowPrivacy = false,
  shouldShowDelete = false,
  size = "small",
}) {
  const history = useHistory();
  const classes = useStyles();
  // const [currentTracks, setCurrentTracks] = useState(tracks);
  const [selectedDeleteTrack, setSelectedDeleteTrack] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const onClickTrack = (slug) => {
    history.push(`/track/${slug}`);
  };

  const handleDeleteClickOpen = (track) => {
    setOpenDelete(true);
    setSelectedDeleteTrack(track);
    console.log("clicked delete button for track: ", track.title);
  };

  const onDeleteClose = () => {
    setOpenDelete(false);
    setSelectedDeleteTrack(null);
  };

  const confirmDeleteTrack = async (slug) => {
    console.log("confirm delete track title:", title);
    try {
      const res = await axios.delete(`api/tracks/${slug}`);
      if (res.status === 200) {
        const updatedProfileTracks = tracks.filter(
          (track) => slug !== track.slug
        );
        setProfileTracks(updatedProfileTracks);
      }
    } catch (e) {
      console.error(e);
    }
  };

  console.log("TrackListTable", user);

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Grid container spacing={2} justify="center" alignItems="center">
        {tracks.map((track) => {
          return <TrackItem key={track.id} track={track} user={user} />;
        })}
      </Grid>
    </Box>
    /*    <Box>
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
              {shouldShowDelete && <TableCell></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {tracks.map((track) => (
              <TableRow
                hover
                className={classes.tableRow}
                key={track.id}
                // onClick={() => onClickTrack(track.slug)}
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
                <TableCell 
                  onClick={() => onClickTrack(track.slug)}>
                  {track.title}
                </TableCell>
                <TableCell>{track.artist}</TableCell>
                <TableCell>{track.genre}</TableCell>
                {shouldShowDelete && (
                  <TableCell padding="checkbox">
                    <DeleteOutline onClick={() => handleDeleteClickOpen(track)} />
                      <ConfirmDialog
                        title="Delete Track"
                        open={openDelete}
                        setOpen={setOpenDelete}
                        onClose={onDeleteClose}
                        onConfirm={() => confirmDeleteTrack(selectedDeleteTrack.slug)}
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
    </Box>*/
  );
}
