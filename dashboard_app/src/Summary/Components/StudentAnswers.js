import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: 300,
    margin: "1rem",
    //   justifyContent:'space-between',
    border: "1px solid",
    flexWrap: "wrap",
    borderRadius: "5px",
    padding: "10px"
  },
  questionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "10%",
    height: "20vh",
    border: "1px solid",
    margin: "12px",
    borderRadius: "5px",
    borderBottom: "10px solid black"
  },
  correctAnswer: {
    color: "green"
  },
  wrongAnswer: {
    textDecoration: "line-through",
    color: "red"
  },
  correctAnswer: {
    textAlign: "right",
    position: "relative",
    top: 100
  }
}));

function StudentAnswers({ quesId, questionList, stuAnswer }) {
  const classes = useStyles();

  //NEW DATA
  console.log("quesId", quesId);

  // let questionList = data.quiz.find(f => f.hasOwnProperty(quizId))[quizId][
  //   "question_details"
  // ];
  // console.log(`Question List in ${quizId}`, questionList);

  let questDetail = questionList.find(f => f.id === quesId);
  console.log("Quest Detail", questDetail);

  let theIdx = questionList.findIndex(e => e.id === quesId);
  console.log("The Idx", theIdx);

  console.log("Student Answer in Student Answers comp", stuAnswer);

  let stuAns = stuAnswer[theIdx];
  console.log("StuAns", stuAns);

  return (
    <div className={classes.mainContainer}>
      <Typography>
        Q{quesId}. : {questDetail["question"]}
      </Typography>

      <div style={{ display: "flex", margin: "5px" }}>
        <Typography>A :</Typography>
        <Typography
          className={`${
            stuAns !== questDetail["answer"] && stuAns === "A"
              ? classes.wrongAnswer
              : ""
          }`}
        >
          {questDetail["A"]}
        </Typography>
        {questDetail["answer"] === "A" ? (
          <CheckCircleIcon style={{ color: "green" }} />
        ) : (
          ""
        )}
      </div>
      <div style={{ display: "flex", margin: "5px" }}>
        <Typography>B :</Typography>
        <Typography
          className={`${
            stuAns !== questDetail["answer"] && stuAns === "B"
              ? classes.wrongAnswer
              : ""
          }`}
        >
          {questDetail["B"]}
        </Typography>
        {questDetail["answer"] === "B" ? (
          <CheckCircleIcon style={{ color: "green" }} />
        ) : (
          ""
        )}
      </div>
      <div style={{ display: "flex", margin: "5px" }}>
        <Typography>C :</Typography>
        <Typography
          className={`${
            stuAns !== questDetail["answer"] && stuAns === "C"
              ? classes.wrongAnswer
              : ""
          }`}
        >
          {questDetail["C"]}
        </Typography>
        {questDetail["answer"] === "C" ? (
          <CheckCircleIcon style={{ color: "green" }} />
        ) : (
          ""
        )}
      </div>
      <div style={{ display: "flex", margin: "5px" }}>
        <Typography>D :</Typography>
        <Typography
          className={`${
            stuAns !== questDetail["answer"] && stuAns === "D"
              ? classes.wrongAnswer
              : ""
          }`}
        >
          {questDetail["D"]}
        </Typography>
        {questDetail["answer"] === "D" ? (
          <CheckCircleIcon style={{ color: "green" }} />
        ) : (
          ""
        )}
      </div>
      <Typography className={classes.correctAnswer}>
        {" "}
        Correct Answer : {questDetail["answer"]}
      </Typography>
    </div>
  );
}

export default StudentAnswers;

{
  /* <Icon style={{color : 'green'}}><CheckCircleIcon style={{color : 'green'}}/></Icon> */
}
