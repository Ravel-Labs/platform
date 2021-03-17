import axios from "axios";
import { useContext } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";

import { UserContext } from "../Context";
import PageWrapper from "../PageWrapper";
import TrackListTable from "../TrackListTable";

const useStyles = makeStyles({
  welcomeBody: {
    textAlign: "left",
    maxWidth: "500px",
  },
  welcomeBodySection: {
    paddingTop: "2vw",
  },
});

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

  return (
    <PageWrapper>
      <Typography variant="h2" component="h1">
        Welcome to Ravel
      </Typography>
      <div className={classes.welcomeBody}>
        <Typography
          variant="h4"
          component="h2"
          className={classes.welcomeBodySection}
        >
          We’re glad you’re here.
        </Typography>
        <Typography variant="body1" className={classes.welcomeBodySection}>
          We are building a community{" "}
          <strong>where artists and listeners can build with each other</strong>
          . Check out the music below and let your voice be heard.
        </Typography>
      </div>
      <TrackListTable
        shouldShowPrivacy
        tracks={featuredTracks}
        title="Today's tracks"
      />
    </PageWrapper>
  );
}

export default Home;
