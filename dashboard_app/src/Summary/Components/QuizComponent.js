import React, { Component } from "react";
import QuizResultsEmotion from "../ResultPages/QuizResultsEmotion";
import QuizResultsDifficulty from "../ResultPages/QuizResultsDifficulty";
import QuizResultsProbability from "../ResultPages/QuizResultsProbability";
import QuizResultsResponseTime from "../ResultPages/QuizResultsResponseTime";

import NavBarSummary from "./NavBarSummary";

import Paper from "@material-ui/core/Paper";

import axios from "axios";


import { data } from "../../utils/data";
import { newAllQuizData, newFormatData } from "../../utils/allquizdata";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
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
    paddingBottom : '64px'
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
   mainBgColor : {
    backgroundColor : '#efeff5'
  },
  spacer: theme.mixins.toobar
});

class QuizComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const { quizId } = this.props.match.params;
    console.log("Quiz Id in quiz component", quizId);

    axios
      .get(`/quiz_details/${quizId}`) // http://ce7798df.ngrok.io/quiz_details/${quizid}
                                                              // http://172.29.59.206:7777/quiz_details/${quizId}
      .then(response => {
        console.log("Response One Quiz", response);
        this.setState({
          data: response.data
        });
      })
      .catch(err => console.log("Error in fetching data", err));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.quizId !== this.props.match.params.quizId) {
      let quizId = this.props.match.params.quizId;
      console.log("Params are different", quizId);

      axios
        .get(`/quiz_details/${quizId}`) // http://ce7798df.ngrok.io/quiz_details/${quizid}
                                                                    // http://172.29.59.206:7777/quiz_details/${quizId}
        .then(response => {
          console.log(`Response One Quiz ${quizId}`, response.data);
          this.setState({
            data: response.data
          });
        })
        .catch(err => console.log("Error in fetching data", err));
    }
  }

  render() {
    const { data } = this.state;
    const {classes} = this.props;
    let quizId = this.props.match.params.quizId;

    console.log(`Data ${quizId}`, data);

    let findData =
      data.length > 0 &&
      data.find(f => f.hasOwnProperty(quizId)) !== undefined &&
      data.find(f => f.hasOwnProperty(quizId))[quizId]['data'];
    console.log(`Find data ${quizId}`, findData);

    return (
      data.length > 0 && findData && (
        <React.Fragment>
          <NavBarSummary />
          {/* <div style={{ fontSize: "100px" }}>
            Hello {this.props.match.params.quizId} // for testing using componentDidUpdate
          </div> */}
          
          <div className={classes.mainContainer}>
              <Paper className={classes.chartContainer}>
                <QuizResultsDifficulty id={quizId} data={findData} />
              </Paper>
              <Paper className={classes.chartContainer}>
                <QuizResultsEmotion id={quizId}  data={findData} />
              </Paper>
              <Paper className={classes.chartContainer}>
                <QuizResultsResponseTime id={quizId}  data={findData} />
              </Paper>
              <Paper className={classes.chartContainer}>
                <QuizResultsProbability id={quizId}  data={findData} />
              </Paper>
            </div>
        
        </React.Fragment>
      )
    );
  }
}

export default withStyles(styles)(QuizComponent);
