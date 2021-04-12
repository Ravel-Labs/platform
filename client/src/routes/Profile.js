import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Box, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useRouteMatch, Link as RouterLink } from "react-router-dom";

import { UserContext } from "../Context";
import EditProfile from "../EditProfile";
import PageWrapper from "../PageWrapper";
import ProfileHeader from "../ProfileHeader";
import TrackListTable from "../TrackListTable";

const useStyles = makeStyles({
  bodyText: {
    textAlign: "left",
    marginTop: "2em",
  },
});

// EmptyWelcome handles display needs when the user has no tracks in their profile.
function EmptyWelcome({ hasUploadPrivilege }) {
  const classes = useStyles();
  return (
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
  );
}

const useProfileStyles = makeStyles({
  profileInfoContainer: {
    textAlign: "left",
  },
});

function Profile() {
  const classes = useProfileStyles();
  const [profileTracks, setProfileTracks] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [profileStats, setProfileStats] = useState(null);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isSubmittingProfileEdit, setIsSubmittingProfileEdit] = useState(false);
  const [profileEditError, setProfileEditError] = useState("");
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
        const res = await axios.get(
          `/api/user/profile-stats/${match.params.username}`
        );
        setProfileStats(res.data);
      } catch (e) {
        console.error(e);
        setProfileStats(null);
      }
    }
    fetchProfileUser();
    fetchProfileTracks();
    fetchProfileStats();
  }, [match.params.username]);

  const onDeleteTrack = async (slug) => {
    try {
      const res = await axios.delete(`api/tracks/${slug}`);
      if (res.status === 200) {
        setProfileTracks(profileTracks.filter((track) => slug !== track.slug));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onProfileEditSubmit = async (payload) => {
    setIsSubmittingProfileEdit(true);
    try {
      const res = await axios.patch(
        `/api/user/${profileUser.username}`,
        payload
      );
      if (res.status === 200) {
        setProfileUser((prevUser) => ({
          ...prevUser,
          ...res.data,
        }));
        setIsProfileEditOpen(false);
      } else {
        setProfileEditError(res.data.errorMessage);
      }
    } catch (e) {
      console.error(e);
      setProfileEditError(e.message);
    }
    setIsSubmittingProfileEdit(false);
  };

  const handleClickEdit = () => {
    setIsProfileEditOpen(true);
  };

  const handleClose = () => {
    setIsProfileEditOpen(false);
  };

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
      {profileUser && profileTracks && profileStats && (
        <Box className={classes.profileInfoContainer}>
          <ProfileHeader
            profileUser={profileUser}
            tracks={profileTracks}
            profileStats={profileStats}
            onClickEdit={handleClickEdit}
          />
          <EditProfile
            errorMessage={profileEditError}
            profileUser={profileUser}
            isOpen={isProfileEditOpen}
            isDisabled={isSubmittingProfileEdit}
            onSubmit={onProfileEditSubmit}
            onClose={handleClose}
          />
        </Box>
      )}
      {profileUser && (
        <Box>
          {filteredTracks.length === 0 ? (
            <EmptyWelcome hasUploadPrivilege={hasUploadPrivilege} />
          ) : (
            <TrackListTable
              shouldShowPrivacy
              shouldShowDelete
              onDeleteTrack={onDeleteTrack}
              tracks={filteredTracks}
              user={profileUser}
              setProfileUser={setProfileUser}
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
