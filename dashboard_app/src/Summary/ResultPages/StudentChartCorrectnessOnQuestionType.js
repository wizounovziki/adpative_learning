import React from 'react'
import ReactEcharts from "echarts-for-react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    style : {
        height:'33vh',
        width : '38vw',
        [theme.breakpoints.between(768,1024.5)]:{
         height : '33vh',
         width : '90vw',
     }
    },
   }));


function StudentChartCorrectnessOnQuestionType({data}) {
    const classes= useStyles();


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
      if(arr !== undefined){
        for (i = 0; i < arr.length; i++) {
            indexes.push(data[arr[i]]);
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
    
    console.log("List Of Quiz in Student prob of correctness Ques type", listOfQuiz)

//Create obj to populate the data
let indicatorArray =[]
for(let i = 0; i < listOfQuiz.length; i++){
    let obj = {}
    obj['name'] = listOfQuiz[i];
    obj['max']= 1

    indicatorArray.push(obj)
}
console.log("Indicator Array", indicatorArray)



let ArrOfQuesType = []
let ArrOfResponses = []


//Search the probability of correctness on question Type
for (let val of listOfQuiz){
    let quizData = quizzes.find(f=>f.hasOwnProperty(val))[val]
    console.log(`Quiz Data ${val}`, quizData)

    let myArrQType =[]
    quizData.question_details.map((e,idx)=> {
        myArrQType[idx] = e['category']
    })
    ArrOfQuesType.push(myArrQType)

    let myResponse = quizData.responses
    ArrOfResponses.push(myResponse)
}

console.log("MyArrQuesType", ArrOfQuesType)
console.log("MyArrOfResponse", ArrOfResponses)

//unique List of Question Type
let uniqueListOfQuesType = [...new Set(ArrOfQuesType.reduce((result,arr)=>{
    return result.concat(arr)
}))]

console.log("Unique List Of Ques Type", uniqueListOfQuesType)


let allAvgOfQuesType = []
for(let val of uniqueListOfQuesType){
    let arrQuestionTypeIndex = []
    ArrOfQuesType.map((e,idx)=> {
        arrQuestionTypeIndex.push(getAllIndexOfCategory(e,val))
    })
    console.log("Arr of Question Type Index", arrQuestionTypeIndex)


    let arrOfResponsesBasedOnIndex = []
    ArrOfResponses.map((e,idx)=> {
        arrOfResponsesBasedOnIndex.push(getElementBasedOnIndex(e,arrQuestionTypeIndex[idx]))
    })
    
    console.log("Arr Of Response based on idx", arrOfResponsesBasedOnIndex)

    let myArr=[]
    arrOfResponsesBasedOnIndex.map((e,idx)=> {
      myArr[idx]=  e.filter(f=>f === true).length/ e.length
    })
    console.log("My Arr", myArr)

    //replace NaN with 0
let newArr = myArr.map((e,idx)=> {
    return isNaN(e) ? 0 : e
})
console.log(`New Arr`, newArr)
    
    allAvgOfQuesType.push(newArr)
}
console.log("AllAvgOfQuesType", allAvgOfQuesType) //[[1,2,3],[1,2,3],[1,2,3]] // refers to [[quiz1, quiz2, quiz3],[quiz1, quiz2, quiz3],[quiz1, quiz2, quiz3]]

    
//Preprocess to calculate the prob of correctness based on Ques Type (change to [[quiz1, quiz1, quiz1],[quiz2, quiz2, quiz2],[quiz3, quiz3, quiz3]])
let dataObj = {}
allAvgOfQuesType[0].forEach((e,idx)=> {
    dataObj[idx] = []
})
// console.log("Data Obj", dataObj)

for(let entry of allAvgOfQuesType){
    for (let i = 0; i < entry.length; i++){
        dataObj[i].push(entry[i])
    }
}
console.log("Current Data Obj", dataObj)

let seriesDataArr = []
for (let property in dataObj){
    seriesDataArr.push(dataObj[property].reduce((a,b)=>a+b) / dataObj[property].length)
}
console.log("Series Data Arr", seriesDataArr)


    const getOption = () => {
        return {
            title: {
                text: 'Probability of Correctness On Question Type',
                x : 'center',
                textStyle : {
                    fontWeight : 'lighter', 
                    fontFamily:'Helvetica',
                    fontSize: 18
                  }
            },
            color : ['#6666ff', '#66e0ff'],
            tooltip: {},
            legend: {
                data: ['Expert', 'Average'],
                x : 'center', 
                bottom : 'bottom'
            },
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: 'black',
                        // backgroundColor: '#999',
                        // borderRadius: 3,
                        // padding: [3, 5]
                   }
                },
                indicator: indicatorArray,
                // [
                //    { name: 'Quiz 1', max: 1},
                //    { name: 'Quiz 2', max: 1},
                //    { name: 'Quiz 3', max: 1},
                //    { name: 'Quiz 4', max: 1},
                //    { name: 'Quiz 5', max: 1},
                //    { name: 'Quiz 6', max: 1}
                // ],
                radius : 60
            },
            series: [{
                name: 'Probability of Correctness on Question Type',
                type: 'radar',
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                // areaStyle: {normal: {}},
                data : [
                   
                     {
                        value : seriesDataArr,
                        name : 'Average'
                    }
                ]
            }]
        }
    }
    

    return (
        

        /* <Hidden only={'xl'}> // intended for Ipad screen
        <ReactEcharts option={getOption()} className={classes.style} />
      </Hidden> */

      /* <Hidden only={['sm','md','lg']}> */ // intended for desktop
        <ReactEcharts
          option={getOption()}
          style={{ height: 300, width: 450 }}
        />
      /* </Hidden> */
    )
}

export default StudentChartCorrectnessOnQuestionType
