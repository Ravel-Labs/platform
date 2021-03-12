import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
import { useRouteMatch } from "react-router-dom";

import { UserContext } from "../Context";
import TrackListTable from "../TrackListTable";
import PageWrapper from "../PageWrapper";

// const useStyles = makeStyles({
//   table: {
//     margin: "2em auto",
//     maxWidth: "800px",
//   },
//   button: {
//     marginTop: "1em",
//   },
// });

function Profile() {
  const [profileTracks, setProfileTracks] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const { user } = useContext(UserContext);
  let match = useRouteMatch();

  // Fetch the tracks from the user corresponding to this profile.
  useEffect(() => {
    async function fetchProfileUser() {
      try {
        const res = await axios.get(`/api/user/${match.params.username}`);
        setProfileUser(res.data);
      } catch (e) {
        console.error(e);
        setProfileUser(null);
      }
    }

    async function fetchProfileTracks() {
      try {
        const res = await axios.get(
          `/api/tracks/user/${match.params.username}`
        );
        setProfileTracks(res.data);
      } catch (e) {
        console.error(e);
        setProfileTracks([]);
      }
    }
    fetchProfileUser();
    fetchProfileTracks();
  }, [match.params.username]);

  // const classes = useStyles();

  // Only show public tracks, unless the logged-in user was referred by this user
  // or is an admin.
  const userPrivileges = user?.privileges || [];
  const isAdminUser = userPrivileges.reduce(
    (accum, privilege) => accum || privilege.type === "admin",
    false
  );
  const filteredTracks = profileTracks.filter((track) => {
    if (!track.isPrivate) {
      return true;
    }
    return Boolean(user) && (isAdminUser || user?.referrerId === track.userId);
  });

  return (
    <PageWrapper>
      {profileUser && (
        <Box>
          <Typography component="h1" variant="h2">
            {profileUser.displayName}
          </Typography>
          <Typography variant="body1">
            Joined {new Date(profileUser.createdAt).toLocaleDateString()}
          </Typography>
          <TrackListTable tracks={filteredTracks} title="Tracks" />
        </Box>
      )}
    </PageWrapper>
  );
}

export default Profile;
