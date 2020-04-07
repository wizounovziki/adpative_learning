import React from 'react';

import ReactEcharts from "echarts-for-react";

// import {emoColor} from "../utils/colorCoding"

function probabilityCorrectOnCategory(arr) {
  let responseArray = []
  for (let i = 0; i < arr.responses.length; i++) {
    let response = { category: arr.question_details[i].data.category, isCorrect: arr.responses[i] }
    responseArray.push(response);
  }

  let keyArray = [];

  let calcObj = {
    keyDetails: [],
    resultArray: [],
  }

  function getKeys(item) {
    keyArray.push(item.data.category);
  }

  function getCounts(item) {
    let correctCount = responseArray.filter((resp) => resp.isCorrect && resp.category === item).length;
    let count = arr.question_details.filter((set) => set.data.category === item).length;
    calcObj.keyDetails.push({name: item, max: count})
    calcObj.resultArray.push(correctCount);
  }

  arr.question_details.forEach(getKeys);

  keyArray = ([...new Set(keyArray)]);

  keyArray.forEach(getCounts);

  return calcObj;

}

function probabilityCorrectOnAnxiety(arr) {
  let responseArray = []
  for (let i = 0; i < arr.responses.length; i++) {
    let response = { emotion: arr.AI[i], isCorrect: arr.responses[i] }
    responseArray.push(response);
  }

  let calcObj = {
    keyArray: [],
    resultArray: [],
  }

  function getKeys(item) {
    calcObj.keyArray.push(item);
  }

  function getCounts(item) {
    let correctCount = responseArray.filter((resp) => resp.isCorrect && resp.emotion === item).length;
    let count = arr.AI.filter((set) => set === item).length;
    let result = correctCount / count;
    calcObj.resultArray.push(result);
  }
  arr.AI.forEach(getKeys);

  calcObj.keyArray = ([...new Set(calcObj.keyArray)]);

  calcObj.keyArray.forEach(getCounts);

  return calcObj;
}

function StudentDetailsGraph(props) {
  const prob1 = probabilityCorrectOnCategory(props.qnsList.details);
  const prob2 = probabilityCorrectOnAnxiety(props.qnsList.details);
  // console.log(prob1);

  return (<div>
    <ReactEcharts
      style={{ height: "45vh", width: "25vw" }}
      lazyUpdate={true}
      option={{
        title: {
          text: 'Probability of \n correctedness on category',
          x: "center",
          top: "5%",
          textStyle: {
            fontWeight: "lighter",
            fontFamily: "Helvetica",
            fontSize: 18,
          }
        },
        color : ['#6666ff', '#66e0ff'],
        radar: {
          radius: "50%",
          indicator: prob1.keyDetails,
          center: ['50%', '60%']
        },
        series: [{
          name: "Some Name",
          type: "radar",
          areaStyle: { normal: {} },
          data: [
            {
              value: prob1.resultArray
            }
          ]
        }]
      }} />
    <ReactEcharts
      style={{ height: "45vh", width: "25vw" }}
      lazyUpdate={true}
      option={{
        title: {
          text: 'Probability of \n Correctedness on Anxiexty',
          x: "center",
          top: "5%",
          textStyle: {
            fontWeight: "lighter",
            fontFamily: "Helvetica",
            fontSize: 18,
          }
        },
        // color: prob2.keyArray.map(str => emoColor(str)),
        xAxis: [
          {
            type: 'category',
            data: prob2.keyArray,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: 'bar',
            barWidth: '50%',
            data: prob2.resultArray
          }
        ],
      }} />
  </div>)
}

export default StudentDetailsGraph;