import axios from "axios";
import { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import PageWrapper from "../PageWrapper";
import TrackDisplay from "../TrackDisplay";
// import { UserContext } from "../Context";

const useStyles = makeStyles({
  copy: {
    paddingBottom: "2vw",
  },
});

function Track() {
  const classes = useStyles();
  let match = useRouteMatch();
  const history = useHistory();
  // const { user } = useContext(UserContext);
  const { trackSlug } = match.params;
  const [track, setTrack] = useState(null);

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await axios.get(`/api/tracks/${trackSlug}`);
        setTrack(res.data);
        console.log("track: ", res.data);
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

  const onArtistNameClick = (username) => {
    console.log(username);
    history.push(`/${username}`);
  };

  const onDeleteTrack = async (slug, username) => {
    try {
      const res = await axios.delete(`/api/tracks/${slug}`);
      if (res.status === 200) {
        // setProfileTracks(profileTracks.filter((track) => slug !== track.slug));
        history.push(`/${username}`);
        // console.log()
      }
    } catch (e) {
      console.error(e);
    }
  };

  // console.log("user context: ", user);

  return (
    <PageWrapper>
      <Typography variant="subtitle2" className={classes.copy}>
        What do you think of the track below? Listen in and don’t forget to
        leave a rating.
      </Typography>
      <TrackDisplay 
        track={track} 
        onFeedbackSubmitted={onFeedbackSubmitted} 
        onArtistNameClick={onArtistNameClick}
        onDeleteTrack={onDeleteTrack}
      />
    </PageWrapper>
  );
}

export default Track;
