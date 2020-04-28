import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import axios from "axios";

import { newAllQuizData } from "../../utils/allquizdata";

import SideBarSummary from "./SideBarSummary";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
    textAlign: "center",
    alignItems: "center"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  appBar: {
    // backgroundColor: theme.palette.secondary.main,
    backgroundColor: "6540d4",
    borderRadius: "0 !important",
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12) !important",
    zIndex: theme.zIndex.drawer + 1
    // transition: theme.transitions.create(["width", "margin"], {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.leavingScreen
    // })
  },
  iconButton: {
    backgroundColor: "white"
  }
}));

function NavBarSummary(props) {
  const classes = useStyles();
  const date = new Date();
  const currentDate = date.toLocaleString();

  const [time, setTime] = useState(currentDate);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [listOfQuiz, setListOfQuiz] = useState([]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTime(new Date().toLocaleString());
  //   }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [time]);

  // useEffect(() => {
  //   console.log("Use Effect is called")
  //   axios
  //     .get(`http://172.29.59.206:5000/quiz_details/0`) // http://ce7798df.ngrok.io/quiz_details/${quiz_id}
  //     .then(response => {
  //       console.log("Response All Quiz", response);
  //       setListOfQuiz(response.data);
  //     })
  //     .catch(err => console.log("Error in fetching data", err));
  // }, []);

  const handleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={handleDrawer}
          >
            <MenuIcon />
          </IconButton>
          {/* will be dynamic value */}
          <Typography>Subject : Math 101</Typography>
          {/* will be dynamic value */}
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Class P1
          </Typography>
          {/* <Typography>{time}</Typography> */}
          <IconButton className={classes.iconButton}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <SideBarSummary
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        listOfQuiz={newAllQuizData}
      />
    </div>
  );
}

export default NavBarSummary;
