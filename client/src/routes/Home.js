import axios from "axios";
import { Typography } from "@material-ui/core";
import { useState, useEffect } from "react";

import PageWrapper from "../PageWrapper";
import TrackListTable from "../TrackListTable";

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
      <Typography variant="h2" component="h1">
        Welcome to Ravel
      </Typography>
      <TrackListTable tracks={featuredTracks} title="Today's tracks" />
    </PageWrapper>
  );
}

export default Home;
