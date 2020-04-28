import React, { useState, useEffect, Component } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import QuizResultsEmotion from "../ResultPages/QuizResultsEmotion";
import QuizResultsDifficulty from "../ResultPages/QuizResultsDifficulty";
import QuizResultsProbability from "../ResultPages/QuizResultsProbability";
import QuizResultsResponseTime from "../ResultPages/QuizResultsResponseTime";
import ReactEcharts from "echarts-for-react";

import NavBarSummary from "./NavBarSummary";

import Paper from "@material-ui/core/Paper";

import axios from "axios";

import { data } from "../../utils/data";
import { newAllQuizData, newFormatData } from "../../utils/allquizdata";


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
    paddingTop: "64px"
  },
  chartContainer: {
    display: "flex",
    flexWrap: "wrap",
    height: "55vh",
    width: "45vw",
    margin: "10px",
    alignItems: "center",
    justifyContent: "space-around"
    //   marginBottom : '2px'
  },
  spacer: theme.mixins.toobar
}));

function Quiz() {
  const classes = useStyles();
  const { quizId } = useParams(); // id here will be string, so need to convert to integer, when we need this id.
  const [myData, setMyData] = useState(data); // if we initialise the state using array, it will run twice,
  //first is empty array, second with data from the useEffect
  

  //New Data
  const [quizData, setQuizData] = useState([]);

  console.log("QuizId", quizId);

  function getQuizData (quizId){
    axios
      // .get(`http://83253bf4.ngrok.io/quiz_details/${quizId}`) // http://ce7798df.ngrok.io/quiz_details/${quizid}
      .get(`/quiz_details/${quizId}`) 
      // .get(`http://localhost:7777/quiz_details/${quizId}`) 
      .then(response => {
        console.log("Response One Quiz", response);
        setQuizData(response.data);
      })
      .catch(err => console.log("Error in fetching data", err));

  }
  
  useEffect(() => {
    console.log(`Use Effect is called in ${quizId}`);
    console.log("QuizID inside Use Effect", quizId)
    // axios
    //   .get(`http://172.29.57.17:7777/quiz_details/${quizId}`) // http://ce7798df.ngrok.io/quiz_details/${quizid}
    //   .then(response => {
    //     console.log("Response One Quiz", response);
    //     setQuizData(response.data);
    //   })
    //   .catch(err => console.log("Error in fetching data", err));
    getQuizData(quizId);

  },[quizId]);

  // console.log(`New All Quiz Data in Quiz ${quizId}`, newAllQuizData);
  // console.log(`New Format Data in Quiz ${quizId}`, newFormatData)
  console.log(`Quiz Data in ${quizId}`, quizData)

  let findData = quizData.length > 0 && quizData !== undefined && quizData.find(f => f.hasOwnProperty(quizId))[quizId]['data']; //change newAllQuizData to quizData
  console.log("Find Data", findData);

  // console.log("My Data", myData);
  
  return (
  quizData.length > 0 && 
  findData !== undefined && 
  ( 
  <React.Fragment>
    <NavBarSummary />
    <div className={classes.mainContainer}>
      <Paper className={classes.chartContainer}>
        <QuizResultsDifficulty id={quizId}  data={findData} />
      </Paper>
      <Paper className={classes.chartContainer}>
        <QuizResultsEmotion id={quizId} data={findData} />
      </Paper>
      <Paper className={classes.chartContainer}>
        <QuizResultsResponseTime id={quizId} data={findData} />
      </Paper>
      <Paper className={classes.chartContainer}>
        <QuizResultsProbability id={quizId} data={findData} />
      </Paper>
    </div>
  </React.Fragment>
  )
  );
}




export default Quiz;
