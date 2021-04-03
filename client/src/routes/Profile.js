import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Box, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useRouteMatch, Link as RouterLink } from "react-router-dom";

import { UserContext } from "../Context";
import TrackListTable from "../TrackListTable";
import PageWrapper from "../PageWrapper";
import ProfileHeader from "../ProfileHeader";

const useStyles = makeStyles({
  bodyText: {
    textAlign: "left",
    marginTop: "2em",
  },
});

function Profile() {
  const classes = useStyles();
  const [profileTracks, setProfileTracks] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [profileStats, setProfileStats] = useState(null);
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

    async function fetchProfileStats() {
      try {
        const res = await axios.get(`/api/user/profile-stats/${match.params.username}`);
        setProfileStats(res.data);
      } catch(e) {
        console.error(e);
        setProfileStats(null);
      }
    }
    fetchProfileUser();
    fetchProfileTracks();
    fetchProfileStats();
  }, [match.params.username]);

  // Only show public tracks, unless the logged-in user was referred by this user
  // or is an admin.
  const userPrivileges = user?.privileges || [];
  const isAdminUser = userPrivileges.reduce(
    (accum, privilege) => accum || privilege.type === "admin",
    false
  );
  const hasUploadPrivilege = userPrivileges.reduce(
    (accum, privilege) => accum || privilege.type === "upload",
    false
  );
  const filteredTracks = profileTracks.filter((track) => {
    if (!track.isPrivate) {
      return true;
    }
    return (
      Boolean(user) &&
      (isAdminUser ||
        user?.referrerId === track.userId ||
        user?.id === track.userId)
    );
  });

  return (
    <PageWrapper>
    {(profileUser && profileTracks && profileStats) && 
      <ProfileHeader 
        profileUser={profileUser} 
        tracks={profileTracks} 
        profileStats={profileStats} />}
      {profileUser && (
        <Box>
          <Typography component="h1" variant="h2">
            {profileUser.displayName}
          </Typography>
          <Typography variant="body1">
            Joined {new Date(profileUser.createdAt).toLocaleDateString()}
          </Typography>
          {filteredTracks.length === 0 ? (
            <Typography variant="body1" className={classes.bodyText}>
              {hasUploadPrivilege ? (
                <>
                  You don't have any tracks yet.{" "}
                  <Link to="/upload" component={RouterLink}>
                    Upload
                  </Link>{" "}
                  to start sharing your music.
                </>
              ) : (
                <>
                  Get started by checking out{" "}
                  <Link to="/" component={RouterLink}>
                    featured tracks
                  </Link>
                  {"."}
                </>
              )}
            </Typography>
          ) : (
            <TrackListTable
              shouldShowPrivacy
              shouldShowDelete={true}
              tracks={filteredTracks}
              setProfileTracks={setProfileTracks}
              title="Tracks"
              size="medium"
            />
          )}
        </Box>
      )}
    </PageWrapper>
  );
}

export default Profile;
