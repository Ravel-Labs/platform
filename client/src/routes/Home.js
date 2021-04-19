import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { UserContext } from "../Context";
import PageWrapper from "../PageWrapper";
import TrackListGrid from "../TrackListGrid";

const useStyles = makeStyles((theme) => ({
  subtitle: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
  welcomeBody: {
    textAlign: "left",
    maxWidth: "500px",
  },
  welcomeBodyEmphasis: {
    fontWeight: 700,
    color: theme.palette.primary.main,
  },
  welcomeBodySection: {
    paddingBottom: theme.spacing(4),
  },
}));

function Home() {
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const { user } = useContext(UserContext);
  const classes = useStyles();

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
    // Ensure we re-fetch tracks when the user logs out.
  }, [user]);

  const onDeleteTrack = async (slug) => {
    try {
      const res = await axios.delete(`api/tracks/${slug}`);
      if (res.status === 200) {
        const updatedProfileTracks = featuredTracks.filter(
          (track) => slug !== track.slug
        );
        setFeaturedTracks(updatedProfileTracks);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageWrapper>
      <Typography variant="h2" component="h1">
        Welcome to Ravel
      </Typography>
      <div className={classes.welcomeBody}>
        <Typography
          variant="h4"
          component="h2"
          className={classes.subtitle}
          color="primary"
        >
          We’re glad you’re here.
        </Typography>
        <Typography variant="body1" className={classes.welcomeBodySection}>
          We are building a community{" "}
          <Typography
            variant="body1"
            component="span"
            className={classes.welcomeBodyEmphasis}
          >
            where artists and listeners can build with each other
          </Typography>
          . Check out the music below and let your voice be heard.
        </Typography>
      </div>
      <TrackListGrid
        shouldShowPrivacy
        shouldShowDelete={false}
        tracks={featuredTracks}
        title="Today's tracks"
        onDeleteTrack={onDeleteTrack}
      />
    </PageWrapper>
  );
}

export default Home;
