import React from 'react'
import ReactEcharts from "echarts-for-react";

function QuizResultsProbability({id, data}) {


// to search for indexes of an emotion
function getAllIndexOfEmotion(arr,val){
    var indexes = [],i;
    for(i= 0; i < arr.length; i++){
        if(arr[i] === val)
        indexes.push(i);
    }return indexes;
}


//to search for responses based on index of respective emotion
function getElementByNumber(myData,arr){
    var indexes = [], i;
    if(arr !== undefined){
        for (i = 0; i < arr.length; i++) {
            indexes.push(myData[arr[i]]);
          }
      }else {
          return indexes
      }return indexes;
}


// NEW DATA
let listOfEmotion = []
data.map((e,idx) =>{
    const currentKey = Object.keys(e).join("");
    listOfEmotion.push(e[currentKey]["emotion"]);
    // listOfEmotion.push(e[`student${idx+1}`]['emotion'])
})

console.log('Emotion', listOfEmotion)

let uniqueListOfEmotion = [
    ...new Set(listOfEmotion.reduce((result,arr)=> {
        return result.concat(arr)
    }))
]

console.log("Unique List Of Emotion", uniqueListOfEmotion)

let indicatorArray = []
for (let key of uniqueListOfEmotion){
    let obj = {};
    obj['name'] = key;
    obj['max'] = 1;
    indicatorArray.push(obj);
}
console.log("Indicator Array", indicatorArray)


// Search the avg probability of correctness for all students on each emotion
let emotion = data.map((e,idx)=> {
    const currentKey = Object.keys(e).join("");
    return e[currentKey].emotion;
    // return e[`student${idx+1}`]['emotion']
})
console.log("Emotion in student", emotion )

let responses = data.map((e,idx)=>{
    const currentKey = Object.keys(e).join("");
    return e[currentKey].responses;
    // return e[`student${idx+1}`]['responses']
})
console.log("Responses in student", responses)


let avgOfProbOfCorrectness = []
for(let val of uniqueListOfEmotion){

let myArrayEmotionTypeIndex = []
emotion.map((e,idx)=> {
    myArrayEmotionTypeIndex.push(getAllIndexOfEmotion(e,val))
})
console.log(`MyArrayType ${val}`, myArrayEmotionTypeIndex)


let myResponse = []
responses.map((e,idx)=> {
    myResponse.push(getElementByNumber(e,myArrayEmotionTypeIndex[idx]))
})

console.log(`My ${val }response`, myResponse)

let prbOfEmotion  = []
myResponse.map((e,idx)=> {
    prbOfEmotion.push(e.filter(f=> f === true).length/ e.length)
})

console.log(`Prob Of ${val}`, prbOfEmotion)

//replace NaN with 0
let newPrbOfEmotion = prbOfEmotion.map((e,idx)=> {
    return isNaN(e) ? 0 : e
})
console.log(`New Prb Of ${val}`, newPrbOfEmotion)


let averageOfEmotion = newPrbOfEmotion.reduce((a,b)=> a + b)/ newPrbOfEmotion.length

console.log("average of Emotion", averageOfEmotion)

avgOfProbOfCorrectness.push(averageOfEmotion)
}

console.log("Average Prob Of Correctness", avgOfProbOfCorrectness)


const getOptionProbability = () => {
return {
        title: {
            text: `Probability of Correctness based on Emotion/Anxiety ${id}`,
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
            orient : 'vertical',
            x: "center",
            data: ['Expert', 'Average'],
            bottom : "bottom",
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
            //    { name: uniqueListOfE[0], max: 1},
            //    { name: uniqueListOfE[1], max: 1},
            //    { name: uniqueListOfE[2], max: 1},
            //    { name: uniqueListOfE[3], max: 1},
            //    { name: uniqueListOfE[4], max: 1},
            // ],
            radius : 110
        },
        series: [{
            name: 'Probability Of Correctness based on Emotion/Anxiety',
            type: 'radar',
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            // areaStyle: {normal: {}},
            data : [
                // {
                //     value : [1, 1, 1, 1, 1],
                //     name : 'Expert'
                // },
                 {
                    value : avgOfProbOfCorrectness,
                    
                    name : 'Average'
                }
            ]
        }]
    }
}

    return (
       
            <ReactEcharts
            option={getOptionProbability()}
            style={{
                height: 340, width: 630
            }}/>
            
       
    )
}

export default QuizResultsProbability
