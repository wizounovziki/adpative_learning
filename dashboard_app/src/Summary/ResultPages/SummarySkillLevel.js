import React from "react";
import ReactEcharts from "echarts-for-react";

function SummarySkillLevel({ summaryData, studentListData }) {
  console.log("New Data in Summary Skill Level", summaryData);

  //Using New Data
  // List Of Quiz
  // let myarr = [];
  // summaryData.map((e, idx) => {
  //   myarr.push(Object.keys(e));
  // });
  // console.log("Object Keys", myarr);

  // let listOfQuiz = myarr.reduce((result, arr) => {
  //   return result.concat(arr);
  // });

  let listOfQuiz = [];
  summaryData.forEach(e => {
    listOfQuiz.push(Object.keys(e).join(""));
  });
  // const studentNames = studentListData.map(e => e.student_name);

  //   Find the average skill level of all student in each quiz
  let avgArr = [];
  for (let key of listOfQuiz) {
    console.log("Key", key);
    let quiz = summaryData.find(f => f.hasOwnProperty(key))[key]["data"];
    console.log(`Quiz ${key}`, quiz);

    let skillArr = quiz.map(e => {
      const currentKey = Object.keys(e).join("");
      return e[currentKey].skill_level;
      // return e[`student${idx + 1}`].skill_level;
    });

    let result = skillArr.reduce((a, b) => a + b) / skillArr.length;
    avgArr.push(result);
  }

  console.log("Avg Arr", avgArr);

  const getOptionSkillLevel = () => {
    return {
      title: {
        text: "Skill Level on Class Level (for All Quizzes)",
        x: "center",
        textStyle: {
          fontWeight: "lighter",
          fontFamily: "Helvetica",
          fontSize: 18
        }
      },
      color: ["#00ffff"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: "3%",
        right: "7%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          data: listOfQuiz,
          axisTick: {
            alignWithLabel: true
          },
          name: "Quiz"
        }
      ],
      yAxis: [
        {
          type: "value",
          name: "Skill Level"
        }
      ],
      series: [
        {
          name: "Average Skill Level",
          type: "bar",
          barWidth: "60%",
          data: avgArr
        }
      ]
    };
  };

  return (
    <div>
      <ReactEcharts
        option={getOptionSkillLevel()}
        style={{ height: 340, width: 550 }}
      />
    </div>
  );
}

export default SummarySkillLevel;
