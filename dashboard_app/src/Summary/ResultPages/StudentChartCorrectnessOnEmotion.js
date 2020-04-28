import React from "react";
import ReactEcharts from "echarts-for-react";
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";

const useStyles = makeStyles(theme => ({
  style: {
    height: "33vh",
    width: "38vw",
    [theme.breakpoints.between(768, 1024.5)]: {
      height: "33vh",
      width: "90vw"
    }
  }
}));

function StudentChartCorrectnessOnEmotion({ data }) {
  const classes = useStyles();


  console.log("Data in Student Chart Correctness On Emotion ", data);

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
      if(arr !== undefined){
        for (i = 0; i < arr.length; i++) {
            indexes.push(myData[arr[i]]);
          }
      }else {
          return indexes
      }
    return indexes;
  }


  //NEW DATA
  let quizzes = data.quiz
  console.log("All Quiz", quizzes)

  //List Of quizzes
  let myarr = [];
  quizzes.map((e, idx) => {
    myarr.push(Object.keys(e));
  });
  console.log("Object Keys", myarr);
  
  let listOfQuiz = myarr.reduce((result, arr) => {
    return result.concat(arr);
  });
  
  console.log("List Of Quiz in Student prob of correctness emotion type", listOfQuiz)

  //List of Emotion 
  let listOfEmotion = []
  for(let val of listOfQuiz){
   let result = quizzes.find(f=>f.hasOwnProperty(val))[val]['quiz_type']
    listOfEmotion.push(result)
  }
  console.log("List Of Emotion", listOfEmotion)

  let uniqueListEmotion = ([...new Set(listOfEmotion.reduce((result,arr)=> result.concat(arr)))])
  console.log("Unique List Emotion", uniqueListEmotion)

  
  let emotionAllQuiz = []
  let responsesAllQuiz = []

  for (let val of listOfQuiz){
    let quizData = quizzes.find(f=>f.hasOwnProperty(val))[val]
    console.log("Quiz Data in probOfCorrectness on emo",quizData)

    emotionAllQuiz.push(quizData.emotion)
    responsesAllQuiz.push(quizData.responses)
    
  }

  console.log('Emotion All Quiz', emotionAllQuiz)
  console.log("Responses All Quiz", responsesAllQuiz)

  let allAvgProbBasedOnEmotion = [];

  for (let val of uniqueListEmotion){
    let arrOfEmotionTypeIndex = [];
    emotionAllQuiz.map((e,idx)=> {
      arrOfEmotionTypeIndex.push(getAllIndexOfEmotion(e,'neural'))
    })
    
    console.log('ArrOFEmotionTypeIndex', arrOfEmotionTypeIndex)

    let arrOfResponsesBasedOnIndex = []
    responsesAllQuiz.map((e,idx)=> {
      arrOfResponsesBasedOnIndex.push(getElementByNumber(e,arrOfEmotionTypeIndex[idx]))
    })
    console.log('arrOfResponsesBasedOnIndex', arrOfResponsesBasedOnIndex)

   let AvgProbOfOneTypeEmo = []
   arrOfResponsesBasedOnIndex.map((e,idx)=> {
     AvgProbOfOneTypeEmo[idx] = e.filter(f=>f===true).length/ e.length
   })
   console.log("Avg Prob Of One Type Emo", AvgProbOfOneTypeEmo)

   allAvgProbBasedOnEmotion.push(AvgProbOfOneTypeEmo)
  
  }
  console.log("allAvgProbBasedOnEmotion", allAvgProbBasedOnEmotion) //[[1,1,1,1],[1,1,1,1],[1,1,1,1],..] refers to [quiz1,quiz2,quiz3] for one emo,


  let seriesData = []

  for(let i = 0; i < uniqueListEmotion.length; i++){
    let obj = {}
    obj['name'] = uniqueListEmotion[i];
    obj['type'] = 'bar';
    obj['barGap'] = 0;
    obj['data'] = allAvgProbBasedOnEmotion[i]
    seriesData.push(obj)

  }

  console.log("Series Data", seriesData)

  


  // var labelOption = {
  //   normal: {
  //     show: true,
  //     position: "inside",
  //     distance: 5,
  //     align: "center",
  //     verticalAlign: "middle",
  //     rotate: {
  //       min: -90,
  //       max: 90
  //     },
  //     formatter: "{c}  {name|{a}}",
  //     fontSize: 16,
  //     rich: {
  //       name: {
  //         textBorderColor: "#fff"
  //       }
  //     }
  //   }
  // };

  const getOption = () => {
    return {
      title: {
        text: "Probability of Correctness on Emotion/Anxiety",
        x: "center",
        textStyle : {
          fontWeight : 'lighter', 
          fontFamily:'Helvetica',
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
      // legend: {
      //   data: ,
      //   x :"center",
      //   bottom : 'bottom'
      // },
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
          data: listOfQuiz
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: seriesData
     
    };
  };

  return (
    <div>
      {/* <Hidden only={'xl'}>
        <ReactEcharts option={getOption()} className={classes.style} />
      </Hidden> */}

      {/* <Hidden only={['sm','md','lg']}> */}
        <ReactEcharts
          option={getOption()}
          style={{ height: 300, width: 450 }}
        />
      {/* </Hidden> */}
    </div>
  );
}

export default StudentChartCorrectnessOnEmotion;
