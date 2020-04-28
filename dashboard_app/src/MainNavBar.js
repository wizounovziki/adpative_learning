import React from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    position: "relative",
    zIndex: 99
  },
  grow: {
    flexGrow: 1,
    textAlign: "center"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  toolBarStyle: {
    backgroundColor: "#6540d4",
  },
  appBar: {
    // backgroundColor: theme.palette.secondary.main,
    backgroundColor: "white",
    borderRadius: "0 !important",
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12) !important",
    zIndex: 1
    // transition: theme.transitions.create(["width", "margin"], {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.leavingScreen
    // })
  },
  iconButton: {
    backgroundColor: "white"
  }
}));

function MainNavBar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolBarStyle}>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Home Page
          </Typography>
          <IconButton className={classes.iconButton}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default MainNavBar;
