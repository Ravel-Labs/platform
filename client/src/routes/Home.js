import axios from "axios";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
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
import { useState, useEffect } from "react";

import PageWrapper from "../PageWrapper";

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

function TrackListDisplay({ tracks }) {
  const history = useHistory();
  const classes = useStyles();

  const onClickTrack = (slug) => {
    history.push(`/track/${slug}`);
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" className={classes.header}>
        Today's tracks
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableCell>Title</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Genre</TableCell>
          </TableHead>
          <TableBody>
            {tracks.map((track) => (
              <TableRow
                hover
                className={classes.tableRow}
                key={track.id}
                onClick={() => onClickTrack(track.slug)}
              >
                <TableCell>{track.title}</TableCell>
                <TableCell>{track.artist}</TableCell>
                <TableCell>{track.genre}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function Home() {
  const [featuredTracks, setFeaturedTracks] = useState([]);
  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await axios.get("/api/tracks/featured");
        setFeaturedTracks(res.data);
      } catch (e) {
        console.error(e);
        setFeaturedTracks([]);
      }
    }
    fetchTracks();
  }, []);
  return (
    <PageWrapper>
      <Typography variant="h1" component="h2">
        Welcome to Ravel
      </Typography>
      <TrackListDisplay tracks={featuredTracks} />
    </PageWrapper>
  );
}

export default Home;
