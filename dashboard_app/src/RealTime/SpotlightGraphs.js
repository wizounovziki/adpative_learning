import React from 'react';

import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core';
import ReactEcharts from "echarts-for-react";

import { difficultyColor } from "../utils/colorCoding";

const useStyles = makeStyles({
  root: {
    marginTop: 32,
    padding: 4
  },
  spacer: {
    height: 32,
    visibility: 'hidden'
  },
})

function consolidateByDifficulty(array) {

  let keyArray = [];
  let dataObjArr = [];

  function getDifficultyValues(item) {
    keyArray.push(item.details.difficulties[item.details.difficulties.length - 1]);
  }

  function difficultyCount(item) {
    let count = array.filter((set) => set.details.difficulties[set.details.difficulties.length - 1] === item).length
    dataObjArr.push({ name: item, value: count })
  }

  array.forEach(getDifficultyValues);

  keyArray = ([...new Set(keyArray)]).sort((a, b) => a - b);

  keyArray.forEach(difficultyCount);

  return dataObjArr;
}

function consolidateByEmotion(array) {

  let keyArray = [];
  let dataObjArr = [];

  function getEmotionValues(item) {
    keyArray.push(item.details.AI[item.details.AI.length - 1]);
  }

  function emotionCount(item) {
    let count = array.filter((set) => set.details.AI[set.details.AI.length - 1] === item).length
    dataObjArr.push({ name: item, value: count })
  }

  array.forEach(getEmotionValues);

  keyArray = ([...new Set(keyArray)]).sort();

  keyArray.forEach(emotionCount);

  return dataObjArr;

}

function SpotlightGraphs(props) {
  const classes = useStyles();
  const { studentState } = props

  const byDifficulty = consolidateByDifficulty(studentState);
  const byEmotion = consolidateByEmotion(studentState);

  return (<div className={classes.root}>
    <Paper>
      <ReactEcharts
        style={{ height: 335, width: "25vw" }}
        lazyUpdate={true}
        option={{
          title: {
            text: "Class Difficulty Breakdown",
            x: "center",
            top: "5%",
            textStyle: {
              fontWeight: "lighter",
              fontFamily: "Helvetica",
              fontSize: 18,
            }
          },
          color: byDifficulty.map(int => difficultyColor(int.name)),
          tooltip: {
            trigger: "item",
            formatter: "Difficulty : {b} <br/> Total : {c} ({d}%)",
            textStyle: {
              fontWeight: 'bolder',
            }
          },
          legend: {
            orient: "horizontal",
            x: "center",
            bottom: "bottom",
          },
          series: {
            type: 'pie',
            data: byDifficulty,
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
              },
            },
            labelLine: {
              normal: {
                show: true
              }
            },
          }
        }} />
      <ReactEcharts
        style={{ height: 335, width: "25vw" }}
        lazyUpdate={true}
        option={{
          title: {
            text: "Class Breakdown by Emotion",
            x: "center",
            top: "5%",
            textStyle: {
              fontWeight: "lighter",
              fontFamily: "Helvetica",
              fontSize: 18,
            }
          },
          color: byEmotion.map(str => props.mapColor(str.name)),
          tooltip: {
            trigger: "item",
            formatter: "Emotion : {b} <br/> Total : {c} ({d}%)",
            textStyle: {
              fontWeight: 'bolder'
            }
          },
          legend: {
            orient: "horizontal",
            x: "center",
            bottom: "bottom",
          },
          series: {
            type: 'pie',
            data: byEmotion,
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
          }
        }} />
    </Paper>
  </div>
  )
}

export default SpotlightGraphs;