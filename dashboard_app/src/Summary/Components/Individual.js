import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import StudentAvatar from "./StudentAvatar";

import MobileStepper from "@material-ui/core/MobileStepper";

import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
// import SwipeableViews from "react-swipeable-views";
// import { autoPlay } from "react-swipeable-views-utils";

import { data } from "../../utils/data";

import { emoColor } from "../../utils/colorCoding";

import axios from "axios";

import NavBarSummary from "./NavBarSummary";
// const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles(theme => ({
  main: {
    display: "flex",
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: "64px",
    paddingBottom : '64px'
  },
  root: {
    maxWidth: 400,
    flexGrow: 1
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default
  },
  img: {
    height: 255,
    display: "block",
    maxWidth: 400,
    overflow: "hidden",
    width: "100%"
  }
}));

const itemsPerPage = 8;

console.log("MyDataInIndividual", data);

function Individual() {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [studentList, setStudentList] = useState([]);
  // const maxSteps =
  //   studentArr.length % 8 > 0
  //     ? Math.floor(studentArr.length / 8) + 1
  //     : studentArr.length / 8;

  useEffect(() => {
    axios
      .get(`/student_list`) 
      .then(response => {
        setStudentList(response.data);
      })
      .catch(err => console.log("Error in fetching data", err));
  }, []);

  console.log("Student List in Individual", studentList);

  // const maxSteps =
  //   data.length % 8 > 0 ? Math.floor(data.length / 8) + 1 : data.length / 8;

  const maxSteps =
    studentList.length % 8 > 0
      ? Math.floor(studentList.length / 8) + 1
      : studentList.length / 8;

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleStepChange = step => {
    setActiveStep(step);
  };

  // console.log("Active Step", activeStep)
  console.log("ActiveStep", activeStep);

  return (
    studentList.length > 0 && (
      <React.Fragment>
        <NavBarSummary />
        <div
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          <div className={classes.main}>
            {/* {studentArr
            .slice(
              activeStep * itemsPerPage,
              activeStep * itemsPerPage + itemsPerPage
            )
            .map((student, idx) => (
              
              <StudentAvatar student={student} key={idx} />
            ))} */}
            {studentList
              .slice(
                activeStep * itemsPerPage,
                activeStep * itemsPerPage + itemsPerPage
              )
              .map((student, idx) => (
                <StudentAvatar
                  student={student}
                  key={idx}
                  name={student.student_name}
                  picture={student.image}
                  difficulty={student.difficulty}
                  proficiency={student.proficiency}
                  emotion={student.emotion}
                />
              ))}
          </div>
          {/* <div className={classes.main}>
            {studentArr.slice(0,8).map((student, idx) => (
              <StudentAvatar student={student} />
            ))}
          </div>
          <div className={classes.main}>
            {studentArr.slice(8,studentArr.length).map((student, idx) => (
              <StudentAvatar student={student} />
            ))}
          </div> */}
        </div>
        <MobileStepper
          steps={maxSteps}
          position="bottom"
          variant="text"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </React.Fragment>
    )
  );
}

export default Individual;
