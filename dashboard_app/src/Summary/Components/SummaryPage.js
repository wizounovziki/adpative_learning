import React, { useState, useEffect } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import SummaryResults from "../ResultPages/SummaryResults";
import SummarySkillLevel from "../ResultPages/SummarySkillLevel";
import SummaryDifficultyLevel from "../ResultPages/SummaryDifficultyLevel";
import SummaryProbability from "../ResultPages/SummaryProbability";
import SummaryRecommendation from "../ResultPages/SummaryRecommendation";

import NavBarSummary from "./NavBarSummary";

import { data } from "../../utils/data";
import { newAllQuizData, newFormatData } from "../../utils/allquizdata";

import Paper from "@material-ui/core/Paper";
import axios from "axios";

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
    paddingTop: "64px",
    paddingBottom: "64px"
    // marginTop : '40px'
  },
  chartContainer: {
    display: "flex",
    flexWrap: "wrap",
    height: 350,
    width: 650,
    margin: "10px",
    alignItems: "center",
    padding: 15,
    justifyContent: "space-around"
    //   marginBottom : '2px'
  },
  recommendationContainer: {
    display: "flex",
    height: "55vh",
    width: "45vw",
    margin: "10px",
    padding: "15px"
    //   marginBottom : '2px'
  },
  mainBgColor: {
    backgroundColor: "#efeff5"
  },
  spacer: theme.mixins.toolbar
}));

function SummaryPage() {
  const classes = useStyles();
  const [summaryData, setData] = useState([]);
  const [studentListData, setStudentlist] = useState([]);

  console.log("New All Quiz Data", newAllQuizData);
  console.log("New Format Data", newFormatData);

  useEffect(() => {
    getSummaryData();
    getStudentList();
    // console.log("Use Effect is called")
    // axios
    //   .get(`/quiz_details/0`)
    //   .then(response => {
    //     console.log("Response All Quiz", response);
    //     setData(response.data);
    //   })
    //   .catch(err => console.log("Error in fetching data", err));
  }, []);

  const getSummaryData = () => {
    axios
      .get(`/quiz_details/0`)
      .then(response => {
        console.log(" Retrieved all quiz data", response.data);
        setData(response.data);
      })
      .catch(err => console.log("Error in fetching data", err));
  };

  const getStudentList = () => {
    axios
      .get(`/student_list`)
      .then(response => {
        console.log(" Retrieved student list", response.data);
        setStudentlist(response.data);
      })
      .catch(err => console.log("Error in fetching data", err));
  };

  // console.log("Summary Data", summaryData);

  return (
    summaryData.length > 0 && (
      //  newAllQuizData &&
      <React.Fragment>
        <NavBarSummary />

        {/* <div className={classes.spacer}> */}
        <div className={classes.mainContainer}>
          <Paper className={classes.chartContainer}>
            <SummarySkillLevel summaryData={summaryData} studentListData={studentListData} />
          </Paper>
          <Paper className={classes.chartContainer}>
            <SummaryDifficultyLevel summaryData={summaryData} />
          </Paper>
          <Paper className={classes.chartContainer}>
            <SummaryProbability summaryData={summaryData} />
          </Paper>
          <Paper className={classes.chartContainer}>
            <SummaryRecommendation summaryData={summaryData} />
          </Paper>
        </div>
        {/* </div> */}
      </React.Fragment>
    )
  );
}

export default SummaryPage;

{
  /* <p>This is Summary Page of a Class</p>
      <p> There will be a chart on : </p>
      <p>
        - All Quiz vs Skill Level of the class (take the average of students
        from the class P1)
      </p>
      <p>
        - All Quiz vs Difficulty of the question (the average of the difficulty
        in each quiz)
      </p>
      <p>- Question Type (for all Quiz) vs Anxiety Level </p>
      <p>- Question Type (for all Quiz) vs Correctness</p>
      <p>- Question Type (for all Quiz) vs Response Time</p>
      <p>- Question Type (for all Quiz) vs Difficulty</p>
      <p>- Prob of correctness on anxiety</p> */
}
{
  /* <SummaryResults quizData={quizzes}/> */
}
