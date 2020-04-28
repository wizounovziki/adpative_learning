import React from 'react'

import { makeStyles } from "@material-ui/core/styles";

import Paper from '@material-ui/core/Paper';

import StudentQuestions from "./StudentQuestions"
import StudentAnswers from "./StudentAnswers"
// import Legend from './Legend'

// import Legend from "../../SharedComponents/Legend"
import Legend from "./Legend"

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper
    },
    mainContainer: {
      display: "flex",
      width : '100%',
      height : 700,
      margin:'1rem',
      flexWrap : 'wrap',
      padding : 10,
    //   justifyContent:'space-between',
      // border : '1px solid',
      borderRadius: '5px'
    }, 
    chartContainer : {
        display:'flex',
        flexWrap : 'wrap',
        height : '47%',
        width :'48%',
        margin: '10px',
        alignItems:'center',
        justifyContent:'space-around'
        // padding: '15px'
      //   marginBottom : '2px'
    }, 
    legendContainer : {
        display : 'flex',
        // flexDirection : 'column',
        // border : '1px solid black',
        width : '100%',
        margin : '10px',
        height : '20%'
    }
  }));


function StudentAnsweredQuestions({student,quizId,data}) {
    console.log("quizId in Student Answered Questions", quizId)
    console.log("Data in Student Answered Questions", data)

    const classes = useStyles();

    return (
        <Paper className = {classes.mainContainer} elevation={2}>
            <StudentQuestions student={student} quizId ={quizId} data={data}/>
            <div className = {classes.legendContainer}> 
                <Legend/>
            </div>
        </Paper>
    )
}

export default StudentAnsweredQuestions;
