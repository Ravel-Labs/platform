import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { AddCircle, CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";

import { UserContext } from "../Context";
import PageWrapper from "../PageWrapper";

const profileFields = [
  ["name", "Name"],
  ["displayName", "Display name"],
  ["username", "Username"],
  ["email", "Email"],
  [
    "createdAt",
    "Date joined",
    (val) =>
      new Date(val).toDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
  ],
];

const useStyles = makeStyles({
  table: {
    margin: "2em auto",
    maxWidth: "800px",
  },
  button: {
    marginTop: "1em",
  },
});

function InvitesTable({ invites }) {
  const classes = useStyles();
  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Created</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invites.map((invite) => (
            <TableRow key={invite.id}>
              <TableCell>
                {new Date(invite.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{invite.code}</TableCell>
              <TableCell>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {invite.isClaimed ? (
                    <>
                      <CheckBox style={{ color: green[500] }} /> Claimed
                    </>
                  ) : (
                    <>
                      <CheckBoxOutlineBlank color="action" /> Unclaimed
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Invites({ invitesRemaining, onInviteCreated }) {
  const classes = useStyles();
  const [userInviteCodes, setUserInviteCodes] = useState([]);

  useEffect(() => {
    async function fetchInviteCodes() {
      try {
        const res = await axios.get("/api/invite-codes");
        setUserInviteCodes(res.data);
      } catch (err) {
        console.error("failed fetching track", err);
      }
    }

    fetchInviteCodes();
  }, []);

  const onClickCreateInvite = async () => {
    try {
      const res = await axios.post("/api/invite-codes");
      setUserInviteCodes((prevCodes) => [res.data].concat(prevCodes));
      onInviteCreated();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box>
      <InvitesTable invites={userInviteCodes} />
      <Typography variant="body1" color="textSecondary">
        You have {invitesRemaining} invites remaining.
      </Typography>
      <Button
        disabled={invitesRemaining <= 0}
        className={classes.button}
        variant="contained"
        color="primary"
        startIcon={<AddCircle />}
        onClick={onClickCreateInvite}
      >
        Create new invite code
      </Button>
    </Box>
  );
}

function Profile() {
  const { user, onUpdateUser } = useContext(UserContext);
  const classes = useStyles();

  const onInviteCreated = () => {
    onUpdateUser((prevUser) => ({
      ...prevUser,
      invitesRemaining: prevUser.invitesRemaining - 1,
    }));
  };

  return (
    <PageWrapper>
      {user && (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2">
              Account info
            </Typography>
            <TableContainer component={Paper} className={classes.table}>
              <Table size="small">
                <TableBody>
                  {profileFields.map(([field, label, transform]) => {
                    const val = transform
                      ? transform(user[field])
                      : user[field];
                    return (
                      <TableRow key={`${field}-${val}`}>
                        <TableCell>{`${label}:`}</TableCell>
                        <TableCell>{val}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2">
              Invites
            </Typography>
            <Invites
              invitesRemaining={user.invitesRemaining}
              onInviteCreated={onInviteCreated}
            />
          </Grid>
        </Grid>
      )}
    </PageWrapper>
  );
}

export default Profile;
