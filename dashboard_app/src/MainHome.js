import React from "react";

import background from "./assets/isometric-teamwork-office-vector.jpg";

import { Button, Divider, Paper, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import PollIcon from "mdi-react/PollIcon";
import GoogleClassroomIcon from "mdi-react/GoogleClassroomIcon";

import MainNavBar from "./MainNavBar";

const useStyles = makeStyles(theme => ({
  body: {
    display: "flex",
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: "85vh",
    backgroundColor: "white"
  },
  backgroundImage: {
    bottom: 80,
    height: "75%",
    maxHeight: 650,
    right: 50,
    position: "absolute",
    zIndex: 0
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    height: 150,
    justifyContent: "flex-end",
    marginRight: 32,
    padding: 32,
    width: 120,
    zIndex: 1
  },
  buttonMainContainer: {
    alignItems: "flex-start",
    display: "flex",
    // margin: "auto",
    width: "90%",
    // height: "50%",
    padding: 50,
    justifyContent: "flex-start"
    // border: '1px solid black',
  },
  buttonIcon: {
    color: "#6540d4",
    height: 45,
    marginBottom: 16,
    width: 45
  },
  buttonText: {
    color: "#555",
    fontFamily: "arial",
    fontSize: 14,
    fontWeight: 700,
    textTransform: "uppercase"
    // marginTop: "auto"
  },
  divider: {
    width: "90%"
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    width: "100%"
  },
  layout: {
    display: "flex",
    flexDirection: "column"
  },
  margin: {
    display: "flex",
    margin: theme.spacing(1)
  }
}));

function MainHome() {
  const classes = useStyles();
  let history = useHistory();

  const handleMonitorClick = () => {
    history.push("/monitor");
  };
  const handleSummaryClick = () => {
    history.push("/summary");
  };

  return (
    <>
      <div className={classes.layout}>
        <MainNavBar />
        <div className={classes.body}>
          <div className={classes.buttonMainContainer}>
            <Paper
              elevation={5}
              className={classes.button}
              onClick={handleMonitorClick}
            >
              <GoogleClassroomIcon className={classes.buttonIcon} />
              <Typography className={classes.buttonText}>
                Virtual Classroom
              </Typography>
            </Paper>
            <Paper
              elevation={5}
              className={classes.button}
              onClick={handleSummaryClick}
              href="/summary"
            >
              <PollIcon className={classes.buttonIcon} />
              <Typography className={classes.buttonText}>
                Class Progress
              </Typography>
            </Paper>
          </div>
        </div>
        <img className={classes.backgroundImage} src={background} />
      </div>
      <div className={classes.margin} />
      <div className={classes.margin} />
      <div className={classes.footer}>
        <Divider className={classes.divider} />
      </div>
    </>
  );
}

export default MainHome;
