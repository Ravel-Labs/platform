import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore, ExpandLess } from "@material-ui/icons";
import { grey } from "@material-ui/core/colors";
import {
  AppBar,
  Box,
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
} from "@material-ui/core";

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
  popper: {
    zIndex: 1,
  },
}));

export default function Header() {
  const classes = useStyles();
  const history = useHistory();

  const { user, onUpdateUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggleMenu = () => {
    setIsMenuOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setIsMenuOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setIsMenuOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(isMenuOpen);
  useEffect(() => {
    if (
      prevOpen.current === true &&
      isMenuOpen === false &&
      anchorRef.current
    ) {
      anchorRef.current.focus();
    }

    prevOpen.current = isMenuOpen;
  }, [isMenuOpen]);

  const onClickLogout = async (e) => {
    handleClose(e);
    await axios.post("/api/auth/logout");
    onUpdateUser(null);
    history.push("/");
  };

  const onClickProfile = async (e) => {
    handleClose(e);
    history.push(`/${user.username}`);
  };

  const onClickAccount = async (e) => {
    handleClose(e);
    history.push(`/${user.username}/account`);
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
                endIcon={isMenuOpen ? <ExpandLess /> : <ExpandMore />}
                className={classes.button}
                onClick={handleToggleMenu}
                ref={anchorRef}
              >
                {user.username}
              </Button>
              <Popper
                className={classes.popper}
                open={isMenuOpen}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={isMenuOpen}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDown}
                        >
                          <MenuItem onClick={onClickProfile}>Profile</MenuItem>
                          <MenuItem onClick={onClickAccount}>Account</MenuItem>
                          <MenuItem onClick={onClickLogout}>Logout</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
