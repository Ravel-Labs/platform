import { useState, useEffect } from "react";
import { useRouteMatch, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import PageWrapper from "../PageWrapper";

function StatDisplay({ stat }) {
  return (
    <div>
      {Object.entries(stat).map(([key, val]) => {
        return (
          <div key={key}>
            <span>{key}: </span>
            <span>{val}</span>
          </div>
        );
      })}
    </div>
  );
}

function StatGroupDisplay({ title, stats }) {
  return (
    <div>
      <h2>{title}</h2>
      {(!stats || stats.length === 0) && <div>No stats.</div>}
      {stats?.map((stat) => (
        <div key={stat.promptId}>
          {" "}
          <StatDisplay stat={stat} />{" "}
        </div>
      ))}
    </div>
  );
}

const useStyles = makeStyles({
  bodyText: {
    textAlign: "left",
    marginTop: "2em",
  },
});

function TrackStats() {
  const classes = useStyles();
  let match = useRouteMatch();
  const trackSlug = match.params.trackSlug;
  const [stats, setStats] = useState({});

  useEffect(() => {
    async function fetchStats() {
      try {
        const payload = { trackSlug };
        const res = await axios.post(`/api/stats/${trackSlug}`, payload);
        setStats(res.data);
      } catch (err) {
        console.log("failed fetching stats: ", err);
      }
    }
    fetchStats();
  }, [trackSlug]);
  return (
    <PageWrapper>
      <Typography variant="h2" component="h1">
        {stats.track?.title}
      </Typography>
      {stats?.feedbackStats?.length > 0 ? (
        <Box paddingTop={4}>
          <Typography variant="h4" component="h2">
            Listener feedback
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Prompt</TableCell>
                  <TableCell>Average rating</TableCell>
                  <TableCell>Response count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats?.feedbackStats.map((feedbackInfo) => (
                  <TableRow key={feedbackInfo.promptId}>
                    <TableCell>{feedbackInfo.prompt}</TableCell>
                    <TableCell>
                      {feedbackInfo.averageScore} / {feedbackInfo.scale}
                    </TableCell>
                    <TableCell>{feedbackInfo.numberOfResponses}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Typography variant="body1" className={classes.bodyText}>
          No track feedback yet. Check back soon for initial responses from
          listeners.{" "}
        </Typography>
      )}
      <Typography variant="body1" className={classes.bodyText}>
        <Button
          component={RouterLink}
          to={`/track/${trackSlug}`}
          startIcon={<ArrowBackIos />}
          color="primary"
        >
          Back
        </Button>
      </Typography>
      {/* TODO: Display playback stats once query is resolved. */}
        <StatGroupDisplay stats={stats?.playbackStats} title="Playback stats" />
    </PageWrapper>
  );
}

export default TrackStats;
