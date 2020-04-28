import React from "react";
import ReactEcharts from "echarts-for-react";

function QuizResultsDifficulty({ id, data }) {
  //NEW DATA
  console.log("My new data in difficulty chart", data);

  //Unique List of Difficulty Type
  let listOfDifficulty = [];
  data.map((e, idx) => {
    const currentKey = Object.keys(e).join("");
    listOfDifficulty.push(e[currentKey]["difficulties"]);
    // listOfDifficulty.push(e[`student${idx + 1}`]["difficulties"]);
  });
  console.log("List Of Difficulty", listOfDifficulty);

  let uniqueListOfDifficulty = [
    ...new Set(
      listOfDifficulty.reduce((result, arr) => {
        return result.concat(arr);
      })
    )
  ].sort((a, b) => a - b);

  console.log("Unique List Of Difficulty", uniqueListOfDifficulty);

  //Search Total Number Of Student For Each Difficulty
  let totalDifficultyOfNumber = [];
  for (let val of uniqueListOfDifficulty) {
    let allList = listOfDifficulty.reduce((result, arr) => {
      return result.concat(arr);
    });

    let numOfDiffType = allList.filter(f => f === val).length;
    console.log("numOfDiffType", numOfDiffType);

    totalDifficultyOfNumber.push(numOfDiffType);
  }

  console.log("Total Difficulty Of Number", totalDifficultyOfNumber);

  //Create obj to populate the data
  let seriesData = [];
  for (let i = 0; i < totalDifficultyOfNumber.length; i++) {
    let obj = {};
    obj["value"] = totalDifficultyOfNumber[i];
    obj["name"] = uniqueListOfDifficulty[i];

    seriesData.push(obj);
  }

  console.log("Series Data in Difficulty Chart", seriesData);

  const getOptionDifficulty = () => {
    return {
      title: {
        text: `Difficulty Level of Question on ${id}`,
        x: "center",
        textStyle: {
          fontWeight: "lighter",
          fontFamily: "Helvetica",
          fontSize: 18
        }
      },
      color: ["#ffccff", "#ffb3ff", "#ff66ff", "#ff1aff", "#e600e6", "#b300b3"],

      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>Type : {b} <br/> Total : {c} ({d}%)",
        textStyle: {
          fontWeight: "bolder"
        }
      },
      legend: {
        orient: "horizontal",
        x: "center",
        bottom: "bottom",
        data: uniqueListOfDifficulty
      },
      series: [
        {
          name: "Question Difficulty Type ",
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
      option={getOptionDifficulty()}
      style={{ height: 340, width: 630 }}
    />
  );
}

export default QuizResultsDifficulty;
