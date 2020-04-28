import React, { useEffect, useRef } from "react";
import ReactEcharts from "echarts-for-react";

import axios from "axios";

function QuizResultsEmotion({ id, data }) {
  console.log("Id", id);

  //NEW DATA
  let listOfEmotion = [];
  data.map((e, idx) => {
    const currentKey = Object.keys(e).join("");
    listOfEmotion.push(e[currentKey]["emotion"]);
    // listOfEmotion.push(e[`student${idx+1}`]['emotion'])
  });

  console.log("Emotion", listOfEmotion);

  let uniqueListOfEmotion = [
    ...new Set(
      listOfEmotion.reduce((result, arr) => {
        return result.concat(arr);
      })
    )
  ];

  console.log("Unique List Of Emotion", uniqueListOfEmotion);

  //Search Total Number Of Student For Each Emotion
  let totalDifficultyOfEmotion = [];

  for (let val of uniqueListOfEmotion) {
    let allEmotion = listOfEmotion.reduce((result, arr) => {
      return result.concat(arr);
    });

    console.log("All Emotion", allEmotion);

    let numOfEmotionType = allEmotion.filter(f => f === val).length;
    console.log("NumOfEmotionType", numOfEmotionType);

    totalDifficultyOfEmotion.push(numOfEmotionType);
  }
  console.log("Total difficulty Of Emotion", totalDifficultyOfEmotion);

  //Create obj to populate the data
  let seriesData = [];
  for (let i = 0; i < totalDifficultyOfEmotion.length; i++) {
    let obj = {};
    obj["value"] = totalDifficultyOfEmotion[i];
    obj["name"] = uniqueListOfEmotion[i];

    seriesData.push(obj);
  }

  console.log("Series Data in Emotion Chart", seriesData);

  const getOptionAnxiety = () => {
    return {
      title: {
        text: `Emotion of All Students on ${id}`,
        x: "center",
        textStyle: {
          fontWeight: "lighter",
          fontFamily: "Helvetica",
          fontSize: 18
        }
      },
      color: ["#e600ac", "#1affff", "#bfff00", "#e60000", "#ff6600"],
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} times  ({d}%)",
        textStyle: {
          fontWeight: "bolder"
        }
      },
      legend: {
        orient: "horizontal",
        x: "center",
        bottom: "bottom",
        data: uniqueListOfEmotion
      },
      series: [
        {
          name: "Emotion Type",
          type: "pie",
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
          data: seriesData
        }
      ]
    };
  };

  return (
    <ReactEcharts
      option={getOptionAnxiety()}
      style={{ height: 340, width: 630 }}
    />
  );
}

export default QuizResultsEmotion;
