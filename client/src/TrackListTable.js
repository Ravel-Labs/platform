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

export default function TrackListTable({ title, tracks }) {
  const history = useHistory();
  const classes = useStyles();

  const onClickTrack = (slug) => {
    history.push(`/track/${slug}`);
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" className={classes.header}>
        {title}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
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
