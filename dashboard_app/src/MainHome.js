import React from "react";

import background from "./assets/isometric-teamwork-office-vector.jpg";

import { Button, Paper, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import PollIcon from "mdi-react/PollIcon";
import GoogleClassroomIcon from "mdi-react/GoogleClassroomIcon";

import MainNavBar from "./MainNavBar";

const useStyles = makeStyles(theme => ({
  main: {
    display: "flex",
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: "85vh",
    backgroundColor: "white"
  },
  backgroundImage: {
    bottom: 20,
    height: 650,
    right: 20,
    position: "absolute"
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
    width: 120
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
    <React.Fragment>
      <MainNavBar />
      <div className={classes.main}>
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
        <img className={classes.backgroundImage} src={background} />
      </div>
    </React.Fragment>
  );
}

export default MainHome;
