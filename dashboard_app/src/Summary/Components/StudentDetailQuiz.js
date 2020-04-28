import React from "react";

import StudentBio from "./StudentBio";
import StudentAnsweredQuestions from "./StudentAnsweredQuestions";
import Hidden from "@material-ui/core/Hidden";

import { makeStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  mainContainer: {
    display: "flex",
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    [theme.breakpoints.between(768, 1024.5)]: {
      flexDirection: "column"
      //   backgroundColor: "green"
    }
    // marginTop : '40px'
  },
  bioContainer: {
    [theme.breakpoints.between(768, 1024.5)]: {
      display: "flex",
      marginLeft: "10px",
      marginRight: "10px",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "40%"
    },
    [theme.breakpoints.up(1024.5)]:{
        backgroundColor : 'green'
    }
  },
  questionContainer: {
    [theme.breakpoints.between(768, 1024.5)]: {
      display: "flex",
      marginLeft: "10px",
      marginRight: "10px",
      width: "98%",
      flexWrap: "wrap"
    }
  }
}));

function StudentDetailQuiz({ studentId, studentData,data,quizId }) {
  const classes = useStyles();

  const myData = studentData.find(f => f.student_id === studentId);
  console.log(`Data For Student ${studentId}`, myData);

  console.log("Quiz Id in Student Detail", quizId)

  console.log("Data in Student Detail Quiz", data)

  return (
    <React.Fragment>
      {/* For Browser */}
      <Hidden mdDown>
        <Grid container spacing={0}>
          <Grid item xs={2.5} md={2.5} sm={2.5} lg={2.5}>
            <StudentBio student={myData} data={data} studentId={studentId}/>
          </Grid>
          <Grid item xs={9} md={9} sm={9} lg={9}>
            <StudentAnsweredQuestions student={myData} quizId={quizId} data={data} />
          </Grid>
        </Grid>
      </Hidden>

      {/* For Ipad Screen size */}
      <Hidden lgUp>
        {" "}
        <div className={classes.mainContainer}>
          <div className={classes.bioContainer}>
            <StudentBio student={myData} data={data} studentId={studentId}/>
          </div>
          <div className={classes.questionContainer}>
            <StudentAnsweredQuestions student={myData} quizId={quizId}  data={data} />
          </div>
        </div>
      </Hidden>
    </React.Fragment>
  );
}

export default StudentDetailQuiz;
