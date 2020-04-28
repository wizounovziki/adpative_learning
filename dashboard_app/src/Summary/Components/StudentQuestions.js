import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import StudentAnswers from "./StudentAnswers";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import Paper from '@material-ui/core/Paper';

import { emoColor } from "../../utils/colorCoding";

import QuestionAvatar from "../../SharedComponents/QuestionAvatar";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  mainContainer: {
    display: "flex",
    width: "100%",
    height: 200,
    margin: "1rem",
    //   justifyContent:'space-between',
    border: "1px solid",
    //   overflow: "auto",
    // overflowX: "scroll",
    overflowY: "hidden",
    borderRadius: "5px",
    // "&:hover": {
    //   overflowX: "scroll"
    // }
  },

  questionContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    minWidth: "9vw",
    height: "20vh",
    border: "1px solid",
    margin: "2px",
    "&:hover": {
      cursor: "pointer"
    },
    backgroundColor: "grey"
  },

  selectedQuestion: {
    fontWeight: 700,
    backgroundColor: "red" //"#ED6767"
  },
  unSelectedQuestion: {
    backgroundColor: "#d9d9d9"
  },

  ratingContainer: {
    display: "flex",
    alignItems: "center",
    width: "90%",
    flexWrap: "flexWrap",
    borderRadius: "5px",
    backgroundColor: "white"
    // width : '80%',
  },
  borderBottomLost: {
    borderRadius: "5px",
    borderBottom: "10px solid #32cccc "
  },
  borderBottomClosed: {
    borderRadius: "5px",
    borderBottom: "10px solid #ff9899"
  },
  borderBottomLeft: {
    borderRadius: "5px",
    borderBottom: "10px solid #cdcc00"
  },
  borderBottomRight: {
    borderRadius: "5px",
    borderBottom: "10px solid #ffbb34"
  },
  borderBottomCenter: {
    borderRadius: "5px",
    borderBottom: "10px solid #9900cc"
  },
  backgroundLost: {
    backgroundColor: "#32cccc"
  },
  backgroundClosed: {
    backgroundColor: "#ff9899"
  },
  backgroundLeft: {
    backgroundColor: "#cdcc00"
  },
  backgroundRight: {
    backgroundColor: "#ffbb34"
  },
  backgroundCenter: {
    backgroundColor: "#9900cc"
  },

  //styling for question avatar
  question: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-evenly", //Not supported by Edge and IE
    width: 106,
    height: 162,
    borderRadius: 5,
    border: "1px solid black"
    // backgroundColor: 'grey'
  },
  ratingBase: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center", //Not supported by Edge and IE
    width: 98,
    height: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 15
  },
  emotionBar: {
    width: 106,
    height: 14,
    borderRadius: 5,
    marginTop: 4,
    border: "1px solid",
    // backgroundColor : 'grey',
    // backgroundColor : props => emotionColor(props.data.quiz.find(f=>f.hasOwnProperty(props.quizId))[props.quizId]['emotion'])
    backgroundColor: props => emoColor(props.respEmotion)
  }
}));

function EmotionBar(props) {
  const classes = useStyles(props);
  return <div className={classes.emotionBar}></div>;
}

function StudentQuestions(props) {
  const classes = useStyles(props);
  const { quizId, data } = props;
  // let questionDetailsList = student.details.question_details;
  // console.log("questionDetailsList", questionDetailsList);

  // const [qId, setqId] = useState(questionDetailsList[0].id);

  //   let difficultyTypeList = student.details.difficulties;
  //   console.log("Difficulty Type List", difficultyTypeList);

  //   let emotionList = student["details"]["AI"];
  //   console.log("Emotion List", emotionList);

  // let responseList = student["details"]["response_time"];
  // console.log("Response List", responseList);

  //   const showQuestion = id => {
  //     setqId(id);
  //   };

  // NEW DATA
  let questionList = data.quiz.find(f => f.hasOwnProperty(quizId))[quizId][
    "question_details"
  ];
  console.log(`Question List in ${quizId}`, questionList);

  const [quesId, setQuesId] = useState(questionList[0].id);
  //   console.log('Ques ID', quesId)

  let diffTypeList = data.quiz.find(f => f.hasOwnProperty(quizId))[quizId][
    "difficulties"
  ];
  console.log(`Diff Type List ${quizId}`, diffTypeList);

  let emoTypeList = data.quiz.find(f => f.hasOwnProperty(quizId))[quizId][
    "emotion"
  ];
  console.log(`Emo Type List ${quizId}`, emoTypeList);

  let responseTimeList = data.quiz
    .find(f => f.hasOwnProperty(quizId))
    [quizId]["response_time"].map((e, idx) => {
      return Math.floor(e);
    });
  console.log(`Response Type List ${quizId}`, responseTimeList);

  //StudentAnswer
  let studentAnswer = data.quiz.find(f => f.hasOwnProperty(quizId))[quizId][
    "student_answers"
  ];
  console.log(`Student Answers ${quizId}`, studentAnswer);

  questionList.map((e, idx) => {
    e["emotion"] = emoTypeList[idx];
  });
  console.log("New Question List", questionList);

  const showQuestion = id => {
    setQuesId(id);
  };

  return (
    <React.Fragment>
      <Paper className={classes.mainContainer}>
        {/* {questionList.map((e, idx) => {
          return (
            <div
              className={` ${classes.questionContainer} ${
                emoTypeList[idx] === "Closed"
                  ? classes.borderBottomClosed
                  :  emoTypeList[idx] === "Left"
                  ? classes.borderBottomLeft
                  :  emoTypeList[idx] === "Right"
                  ? classes.borderBottomRight
                  : emoTypeList[idx] === "Center"
                  ? classes.borderBottomCenter
                  :  emoTypeList[idx] === "Lost"
                  ? classes.borderBottomLost
                  : ""
              } ${e.id === quesId ? classes.selectedQuestion : ""}`}
              value={e.id}
              onClick={() => showQuestion(e.id)}
            >
              Q{e.id}
              <Typography style={{ textAlign: "center" }}>
                {`${responseList[idx]} seconds`}{" "}
              </Typography>
              <div className={classes.ratingContainer}>
                <Rating
                  readOnly
                  max={5}
                  value={diffTypeList[idx] / 2.0}
                  size={"small"}
                />
              </div>
            </Paper>
          );
        })} */}
        <Tabs
          variant="scrollable"
          scrollButtons="desktop"
          indicatorColor="primary"
        >
          {questionList.map((e, idx) => (
            <Tab
              key={idx}
              label={
                <div style={{ margin: "5px" }}>
                  <div
                    className={`${classes.question} ${
                      e.id === quesId
                        ? classes.selectedQuestion
                        : classes.unSelectedQuestion
                    }`}
                    value={e.id}
                    onClick={() => showQuestion(e.id)}
                  >
                    <div>
                      <b>{`Q ${e.id}`}</b>
                    </div>

                    <div>{`${responseTimeList[idx]} seconds`}</div>
                    <div className={classes.ratingBase}>
                      <Rating
                        readOnly
                        value={diffTypeList[idx]}
                        precision={0.5}
                        size="small"
                      />
                    </div>
                  </div>
                  <EmotionBar respEmotion={e.emotion} />
                </div>
              }
            ></Tab>
          ))}
        </Tabs>
      </Paper>
      <StudentAnswers
        quesId={quesId}
        questionList={questionList}
        stuAnswer={studentAnswer}
      />
    </React.Fragment>
  );
}

export default StudentQuestions;
