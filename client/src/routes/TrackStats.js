import { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import axios from "axios";

import PageWrapper from "../PageWrapper";

// function StatDisplay({ stat }) {
//   return (
//     <div>
//       {Object.entries(stat).map(([key, val]) => {
//         return (
//           <div key={key}>
//             <span>{key}: </span>
//             <span>{val}</span>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function StatGroupDisplay({ title, stats }) {
//   return (
//     <div>
//       <h2>{title}</h2>
//       {(!stats || stats.length === 0) && <div>No stats.</div>}
//       {stats?.map((stat) => (
//         <div key={stat.promptId}>
//           {" "}
//           <StatDisplay stat={stat} />{" "}
//         </div>
//       ))}
//     </div>
//   );
// }

function TrackStats() {
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
      {stats?.feedbackStats?.length > 0 && (
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
      )}
      {/* TODO: Display playback stats once query is resolved. */}
      {/* <StatGroupDisplay stats={stats?.playbackStats} title="Playback stats" /> */}
    </PageWrapper>
  );
}

export default TrackStats;
