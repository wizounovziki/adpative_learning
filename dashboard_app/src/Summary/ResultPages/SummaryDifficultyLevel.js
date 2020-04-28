import React from "react";
import ReactEcharts from "echarts-for-react";
import QuizResultsEmotion from "./QuizResultsEmotion";

function SummaryDifficultyLevel({ summaryData }) {
  //Using New Data
  //Find List Of Quiz
  let myarr = [];
  summaryData.map((e, idx) => {
    myarr.push(Object.keys(e));
  });
  console.log("Object Keys", myarr);

  let listOfQuiz = myarr.reduce((result, arr) => {
    return result.concat(arr);
  });

  console.log("List Of Quiz in Summary Difficulty Level", listOfQuiz);

  let indicatorArray = [];
  for (let key of listOfQuiz) {
    let obj = {};
    obj["name"] = key;
    obj["max"] = 6;
    indicatorArray.push(obj);
  }
  console.log("Indicator Array", indicatorArray);

  //Find Average Difficulty Question Type faced by students
  let avgArr = [];
  for (let key of listOfQuiz) {
    console.log("Key", key);
    let quiz = summaryData.find(f => f.hasOwnProperty(key))[key]["data"];

    let difficulties = quiz.map(e => {
      const currentKey = Object.keys(e).join("");
      return e[currentKey].difficulties;
    });

    // let difficulties = quiz.map((e,idx)=> {
    //     return e[`student${idx+1}`]['difficulties']
    // })
    console.log("Difficulties", difficulties);

    let diff = difficulties.reduce((result, arr) => {
      return result.concat(arr);
    });
    console.log("Diff", diff);

    let result = diff.reduce((a, b) => a + b) / diff.length;
    console.log("Result", result);
    avgArr.push(result);
  }

  console.log("Avg Arr", avgArr);

  const getOptionDifficultyLevel = () => {
    return {
      title: {
        text: "Question Difficulty Type on Class Level (for All Quizzes)",
        x: "center",
        textStyle: {
          fontWeight: "lighter",
          fontFamily: "Helvetica",
          fontSize: 18
        }
      },
      color: ["#6666ff", "#66e0ff"],
      tooltip: {},
      legend: {
        data: ["Expert", "Average"],
        orient: "vertical",
        x: "center",
        bottom: "bottom"
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: "#fff",
            backgroundColor: "#999",
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: indicatorArray,
        radius: 90
      },
      series: [
        {
          name: "预算 vs 开销（Budget vs spending）",
          type: "radar",
          itemStyle: { normal: { areaStyle: { type: "default" } } },
          // areaStyle: {normal: {}},
          data: [
            {
              value: avgArr,
              name: "Average"
            }
          ]
        }
      ]
    };
  };

  return (
    <div>
      <ReactEcharts
        option={getOptionDifficultyLevel()}
        style={{ height: 340, width: 550 }}
      />
    </div>
  );
}

export default SummaryDifficultyLevel;
