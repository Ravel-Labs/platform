import axios from "axios";
import { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import PageWrapper from "../PageWrapper";
import TrackDisplay from "../TrackDisplay";

const useStyles = makeStyles({
  copy: {
    paddingBottom: "2vw",
  },
});

function Track() {
  const classes = useStyles();
  let match = useRouteMatch();
  const { trackSlug } = match.params;
  const [track, setTrack] = useState(null);

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await axios.get(`/api/tracks/${trackSlug}`);
        setTrack(res.data);
      } catch (err) {
        console.error("failed fetching track", err);
      }
    }
    fetchTrack();
  }, [trackSlug]);

  // Optimistally update the track feedback to prevent the need for re-fetch.
  const onFeedbackSubmitted = (newResponse) => {
    setTrack((prevTrack) => {
      let addedFeedback = false;
      const combinedFeedback = prevTrack.userFeedback.map((prevResponse) => {
        if (prevResponse.promptId === newResponse.promptId) {
          addedFeedback = true;
          return newResponse;
        }
        return prevResponse;
      });

      if (!addedFeedback) {
        combinedFeedback.push(newResponse);
      }

      return {
        ...prevTrack,
        userFeedback: combinedFeedback,
      };
    });
  };

  return (
    <PageWrapper>
      <Typography variant="subtitle2" className={classes.copy}>
        What do you think of the track below? Listen in and don’t forget to
        leave a rating.
      </Typography>
      <TrackDisplay track={track} onFeedbackSubmitted={onFeedbackSubmitted} />
    </PageWrapper>
  );
}

export default Track;
