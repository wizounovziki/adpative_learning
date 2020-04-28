import React from 'react'

import { makeStyles } from "@material-ui/core/styles";

import Paper from '@material-ui/core/Paper';

import Typography from "@material-ui/core/Typography";
import Hidden from "@material-ui/core/Hidden";

import StudentChartSkillLevel from "../ResultPages/StudentChartSkillLevel";
import StudentChartCorrectnessOnEmotion from "../ResultPages/StudentChartCorrectnessOnEmotion";
import StudentChartCorrectnessOnQuestionType from "../ResultPages/StudentChartCorrectnessOnQuestionType";
import StudentChartRecommendation from "../ResultPages/StudentChartRecommendation"


const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper
    },
    mainContainer: {
      display: "flex",
      width : '100%',
      height : 700,
      flexWrap : 'wrap',
      padding : 30
    //   justifyContent:'space-between',
    //   border : '1px solid'
    }, 
    chartContainer : {
        display:'flex',
        flexWrap : 'wrap',
        height : 330,
        width : 550, 
        margin: '10px',
        alignItems:'center',
        justifyContent:'space-around',
        [theme.breakpoints.between(768, 1024.5)]:{
          width : '100%',
          height : '50%'
        }
        // padding: '15px'
      //   marginBottom : '2px'
    },
    chartDiv : {
      width : '100%', 
      height : '15%',
      backgroundColor : 'yellow',
      alignItems: 'center', 
      display : 'flex',
      flexWrap : 'wrap',
      justifyContent:'center',
      wordWrap : 'break-word',
      padding : '10px'
    }
  }));

function StudentCharts({student,data}) {
  console.log("Data in Student Chart", data)

  const classes = useStyles();

    return (
    <div className={classes.mainContainer}>
      <Paper className={classes.chartContainer} elevation={2}>
        <StudentChartCorrectnessOnQuestionType data={data}/>
      </Paper>
      <Paper className={classes.chartContainer} elevation={2}>
        <StudentChartCorrectnessOnEmotion data={data}/>
      </Paper>
      <Paper className={classes.chartContainer} elevation={2}>
        <StudentChartSkillLevel  data={data}/>
      </Paper>
      <Paper className={classes.chartContainer} elevation={2}>
        <StudentChartRecommendation data={data}/>
      </Paper>
    </div>
    )
}

export default StudentCharts
