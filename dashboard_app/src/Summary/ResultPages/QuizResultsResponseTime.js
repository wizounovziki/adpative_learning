import React from "react";
import ReactEcharts from "echarts-for-react";
import QuestionDetails from "../../SharedComponents/QuestionDetails";

function QuizResultsResponseTime({ id, data }) {
  // To search indexes of a category
  function getAllIndexOfCategory(arr, val) {
    var indexes = [],
      i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        indexes.push(i);
      }
    }
    return indexes;
  }

  // To search for Response Time based on index of respective category
  function getElementBasedOnIndex(data, arr) {
    var indexes = [],
      i;
    for (i = 0; i < arr.length; i++) {
      indexes.push(data[arr[i]]);
    }
    return indexes;
  }

  //NEW DATA
  console.log("New Data in QType vs Response Time", data);

  //List of Question Type
  let listOfQuestion = [];
  data.map((e, idx) => {
    const currentKey = Object.keys(e).join("");
    listOfQuestion.push(e[currentKey]["question_details"]);
    // listOfQuestion.push(e[`student${idx+1}`][`question_details`])
  });
  console.log("List Of Question", listOfQuestion);

  let listOfQuesType = [];
  listOfQuestion.map((e, idx) => {
    e.map((f, idx) => {
      listOfQuesType.push(f["category"]);
    });
  });
  console.log("List of Question Type", listOfQuesType);

  let uniqueListOfQuestionType = [...new Set(listOfQuesType)];
  console.log("Unique List Of Question Type", uniqueListOfQuestionType);

  //Search index of response time based on emotion
  let quesType = [];
  listOfQuestion.map((e, idx) => {
    quesType[idx] = e.map((f, idx) => {
      return f["category"];
    });
  });

  console.log("Ques Type Of Each Student", quesType);

  let responseTime = data.map((e, idx) => {
    return e[`student${idx + 1}`]["response_time"];
  });
  console.log("Response Time", responseTime);

  //    // To search indexes of a category
  //    function getAllIndexOfCategory(arr, val) {
  //     var indexes = [],
  //       i;
  //     for (i = 0; i < arr.length; i++) {
  //       if (arr[i] === val) {
  //         indexes.push(i);
  //       }
  //     }
  //     return indexes;
  //   }

  //   // To search for Response Time based on index of respective category
  //   function getElementBasedOnIndex(data, arr) {
  //     var indexes = [],
  //       i;
  //     for (i = 0; i < arr.length; i++) {
  //       indexes.push(data[arr[i]]);
  //     }
  //     return indexes;
  //   }

  //Average of Question Type Of All Students
  let avgResponsesBasedOnQuesType = [];

  for (let val of uniqueListOfQuestionType) {
    //'Substraction' Type
    let myQuesTypeIndex = [];
    quesType.map((e, idx) => {
      myQuesTypeIndex.push(getAllIndexOfCategory(e, val));
    });
    console.log(`Ques Type Index ${val}`, myQuesTypeIndex);

    let myResponses = [];
    responseTime.map((e, idx) => {
      myResponses.push(getElementBasedOnIndex(e, myQuesTypeIndex[idx]));
    });
    console.log(`My Responses ${val}`, myResponses);

    let myResponsesAllStudents = myResponses.reduce((result, arr) => {
      return result.concat(arr);
    });
    console.log("My Responses All Students", myResponsesAllStudents);

    let avgResponses =
      myResponsesAllStudents.reduce((a, b) => a + b) /
      myResponsesAllStudents.length;
    console.log(`Avg response ${val}`, avgResponses);

    avgResponsesBasedOnQuesType.push(avgResponses);
  }
  console.log("Avg Response", avgResponsesBasedOnQuesType);

  const getOptionResponseTime = () => {
    return {
      title: {
        text: `Question Type vs Response Time of All Students on ${id}`,
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
        left: "5%",
        right: "11%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          data: uniqueListOfQuestionType, // "Addition", "Subtraction", "Numbers", "Mix", "Multiplication"
          axisTick: {
            alignWithLabel: true
          },
          name: "Category"
        }
      ],
      yAxis: [
        {
          type: "value",
          name: "Response Time"
        }
      ],
      series: [
        {
          name: "Average response time (in seconds)",
          type: "bar",
          barWidth: "50%",
          data: avgResponsesBasedOnQuesType
        }
      ]
    };
  };

  return (
    <ReactEcharts
      option={getOptionResponseTime()}
      style={{ height: 340, width: 630 }}
    />
  );
}

export default QuizResultsResponseTime;
