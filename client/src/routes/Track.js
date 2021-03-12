import { useState, useEffect } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import axios from "axios";

import PageWrapper from "../PageWrapper";
import TrackDisplay from "../TrackDisplay";

function Track() {
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
      <TrackDisplay track={track} onFeedbackSubmitted={onFeedbackSubmitted} />
      {/* TODO: Restrict to only uploader of this track. */}
      <div>
        <Link to={`${match.url}/feedback`}>View track feedback</Link>
      </div>
      <div>
        <Link to={`${match.url}/stats`}>View track stats</Link>
      </div>
    </PageWrapper>
  );
}

export default Track;
