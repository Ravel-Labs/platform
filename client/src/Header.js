import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
import { AppBar, Box, Button, Toolbar } from "@material-ui/core";

import { UserContext } from "./Context";

const uploadPrivilegeType = "upload";
const links = [
  {
    label: "Sign in",
    path: "/login",
    anonymousOnly: true,
    isPrivileged: (user) => true,
  },
  {
    label: "Join",
    path: "/signup",
    anonymousOnly: true,
    isPrivileged: (user) => true,
  },
  {
    label: "Profile",
    path: "/username123",
    loggedInOnly: true,
    isPrivileged: (user) => true,
  },
  {
    label: "Upload",
    path: "/upload",
    loggedInOnly: true,
    isPrivileged: (user) => {
      if (!user) return false;
      return user.privileges
        .map((privilege) => privilege.type)
        .includes(uploadPrivilegeType);
    },
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    color: grey[700],
    backgroundColor: grey[200],
  },
  button: {
    textTransform: "unset",
  },
  titleWrapper: {
    flexGrow: 1,
    display: "flex",
  },
}));

export default function Header() {
  const classes = useStyles();
  const history = useHistory();

  const { user, onUpdateUser } = useContext(UserContext);

  const onClickLogout = async () => {
    onUpdateUser(null);
    await axios.post("/api/auth/logout");
    history.push("/");
  };

  const isUserLoggedIn = Boolean(user);

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Box className={classes.titleWrapper}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              className={classes.button}
            >
              Ravel
            </Button>
          </Box>
          {links.map((link) => {
            if (!isUserLoggedIn && link.loggedInOnly) {
              return null;
            }
            if (
              isUserLoggedIn &&
              (link.anonymousOnly || !link.isPrivileged(user))
            ) {
              return null;
            }
            return (
              <Button
                color="inherit"
                component={Link}
                key={link.label}
                to={link.path}
                className={classes.button}
              >
                {link.label}
              </Button>
            );
          })}
          {isUserLoggedIn && (
            <>
              <Button
                color="inherit"
                className={classes.button}
                onClick={onClickLogout}
              >
                Log out
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
