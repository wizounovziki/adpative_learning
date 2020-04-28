import React from "react";
import ReactEcharts from "echarts-for-react";

function SummaryProbability({ summaryData }) {
  console.log("Summary Data in Probability", summaryData);

  //NEW DATA
  //Find List Of Quiz
  let myarr = [];
  summaryData.map((e, idx) => {
    myarr.push(Object.keys(e));
  });
  console.log("Object Keys", myarr);

  let listOfQuiz = myarr.reduce((result, arr) => {
    return result.concat(arr);
  });

  console.log("List Of Quiz in Summary Probability Level", listOfQuiz);

  //Find List of Emotion
  let listOfEmotion = [];
  for (let key of listOfQuiz) {
    let quiz = summaryData.find(f => f.hasOwnProperty(key))[key]["quiz_type"];
    // let emotion = quiz.map((e,idx)=> {
    //     return e[`student${idx+1}`]['emotion']
    // })
    // console.log(`Emotion ${key}`, emotion)

    // let emo = emotion.reduce((result,arr)=> {
    //     return result.concat(arr)
    // })
    // console.log("Emo", emo)

    listOfEmotion.push(quiz);
  }

  console.log("ListOfEmotion", listOfEmotion);

  let uniqueListOfEmotion = [
    ...new Set(
      listOfEmotion.reduce((result, arr) => {
        return result.concat(arr);
      })
    )
  ];
  console.log("Unique Emotion", uniqueListOfEmotion);

  // to search for indexes of an emotion
  function getAllIndexOfEmotion(arr, val) {
    var indexes = [],
      i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i] === val) indexes.push(i);
    }
    return indexes;
  }

  //to search for responses based on index of respective emotion
  function getElementByNumber(myData, arr) {
    var indexes = [],
      i;

    if (arr !== undefined) {
      for (i = 0; i < arr.length; i++) {
        indexes.push(myData[arr[i]]);
      }
    } else {
      return indexes;
    }
    return indexes;
  }

  //Search for index on the emotion
  let theArrOfProbForAllQuiz = [];
  for (let key of listOfQuiz) {
    let quiz = summaryData.find(f => f.hasOwnProperty(key))[key]["data"];

    let emotion = quiz.map(e => {
      const currentKey = Object.keys(e).join("");
      return e[currentKey].emotion;
    });
    // let emotion = quiz.map((e,idx)=> {
    //     return e[`student${idx+1}`]['emotion']
    // })
    console.log(`Emotion in student ${key}`, emotion);

    // let responses = quiz.map((e, idx) => {
    //   return e[`student${idx + 1}`]["responses"];
    // });
    let responses = quiz.map(e => {
      const currentKey = Object.keys(e).join("");
      return e[currentKey].responses;
    });
    console.log(`Responses in student ${key}`, responses);

    let emoArrForOneQuiz = [];
    for (let val of uniqueListOfEmotion) {
      let myArrayEmoIndex = [];
      emotion.map((e, idx) => {
        myArrayEmoIndex.push(getAllIndexOfEmotion(e, val));
      });
      console.log(`MyArrayEmoIndex ${key} ${val}`, myArrayEmoIndex);

      let myArrayResponseIndex = [];
      responses.map((e, idx) => {
        myArrayResponseIndex.push(getElementByNumber(e, myArrayEmoIndex[idx]));
      });
      console.log(`MyArrayResponseIndex ${key} ${val}`, myArrayResponseIndex);

      let arrOfProb = [];
      myArrayResponseIndex.map((e, idx) => {
        arrOfProb.push(e.filter(f => f === true).length / e.length);
      });

      console.log(`prob of correct ${key} ${val}`, arrOfProb);

      //replace NaN with 0
      let newArrOfProb = arrOfProb.map((e, idx) => {
        return isNaN(e) ? 0 : e;
      });
      console.log("New ArrOfProb", newArrOfProb);

      let averageRes =
        newArrOfProb.reduce((a, b) => a + b) / newArrOfProb.length;

      console.log(`Average res ${key} ${val}`, averageRes);
      emoArrForOneQuiz.push(averageRes);

      console.log("emoArrayForOneQuiz", emoArrForOneQuiz);
    }

    theArrOfProbForAllQuiz.push(emoArrForOneQuiz);
    console.log("theArr", theArrOfProbForAllQuiz); //[[avgOfDistractedQ1, avgOfLostQ1, avgOfEngagedQ1, avgOfNeuralQ1],[avgOfDistractedQ2, avgOfLostQ2, avgOfEngagedQ2, avgOfNeuralQ2]]
  }

  //Preprocess the arr for the series Data
  let dataObj = {};
  theArrOfProbForAllQuiz[0].forEach((e, idx) => {
    dataObj[idx] = [];
  });

  for (let entry of theArrOfProbForAllQuiz) {
    for (let i = 0; i < entry.length; i++) {
      dataObj[i].push(entry[i]);
    }
  }

  console.log("Data Obj", dataObj);

  let arr = [];
  for (let property in dataObj) {
    arr.push(dataObj[property]);
  }
  console.log("Arr", arr);

  let seriesData = [];
  for (let i = 0; i < uniqueListOfEmotion.length; i++) {
    let obj = {};
    obj["name"] = uniqueListOfEmotion[i];
    obj["type"] = "bar";
    obj["barGap"] = 0;
    obj["data"] = arr[i];
    seriesData.push(obj);
  }

  console.log("Series Data", seriesData);

  var labelOption = {
    normal: {
      show: true,
      position: "inside",
      distance: 5,
      align: "center",
      verticalAlign: "middle",
      rotate: {
        min: -90,
        max: 90
      },
      formatter: "{c}  {name|{a}}",
      fontSize: 16,
      rich: {
        name: {
          textBorderColor: "#fff"
        }
      }
    }
  };

  const getOptionProbability = () => {
    return {
      title: {
        text:
          "Probability of Correctness on Anxiety on Class Level (for All Quizzes)",
        x: "center",
        textStyle: {
          fontWeight: "lighter",
          fontFamily: "Helvetica",
          fontSize: 18
        }
      },
      color: ["#003366", "#006699", "#4cabce", "#e5323e"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      legend: {
        data: uniqueListOfEmotion,
        x: "center",
        bottom: "bottom"
      },
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "center",
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          axisTick: { show: false },
          data: listOfQuiz,
          name: "Quiz"
        }
      ],
      yAxis: [
        {
          type: "value",
          name: "Probability"
        }
      ],
      series: seriesData
    };
  };

  return (
    <div>
      <ReactEcharts
        option={getOptionProbability()}
        style={{ height: 340, width: 550 }}
      />
    </div>
  );
}

export default SummaryProbability;
