import React from 'react'
import ReactEcharts from "echarts-for-react";



function SummaryResults({quizData}) {

    const getOptionOne = () => {
   
        let quizName = quizData.map((e,idx) => {return Object.keys(e).join()})


        let chartData=[];
        chartData[0] = quizName; // ["quiz1", "quiz2", "quiz3"]
        chartData[1] = [1,2,3]
  
       
        console.log("Chart Data", chartData)
    
        return { 
            title : {
                text : 'Average Difficulty Test on Each Quiz'
            },
            xAxis : {
                name :'Quiz',
                type: "category",
                data : chartData[0]
                // ["quiz1", "quiz2", "quiz3"]
            },
            yAxis : {
                name: 'Average Difficulty Test',
                type: "value",
                  
            },
            series : [{
                data :chartData[1],
                // [1,2,3]
                type : 'line',
                smooth : true, 
                
            }]

        }
    }

    const getOptionTwo = () => {

        let quizName = quizData.map((e,idx) => {return Object.keys(e).join()})


        let chartData=[];
        chartData[0] = quizName; // ["quiz1", "quiz2", "quiz3"]
        chartData[1] = [6,4,8] // average class Skill Level on each Quiz

        console.log("Chart Data", chartData)
    
        return { 
            title : {
                text : 'Average Class Skill Level on Each Quiz'
            },
            xAxis : {
                name :'Quiz',
                type: "category",
                data : chartData[0]
                // ["quiz1", "quiz2", "quiz3"]
            },
            yAxis : {
                name: 'Average Difficulty Test',
                  type: "value",
                  
            },
            series : [{
                data :chartData[1],
                // [1,2,3]
                type : 'line',
                smooth : true, 
                
            }]

        }
    
    }
   


    return (
        <div>
           <ReactEcharts
           option={getOptionOne()}
           />
           <ReactEcharts
           option={getOptionTwo()}
           />
           </div>
    )
}

export default SummaryResults
