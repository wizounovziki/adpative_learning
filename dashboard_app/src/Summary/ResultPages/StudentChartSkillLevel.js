import React from 'react'
import ReactEcharts from "echarts-for-react";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
    style : {
        height:'33vh',
        width : '38vw',
        [theme.breakpoints.between(768,1024.5)]:{
         height : '50%',
         width : '90vw',
     }
    },
   }));

function StudentChartSkillLevel({ data}) {
    const classes= useStyles();

    console.log("Student Data in Student Chart Skill Level ", data)

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
    
    console.log("List Of Quiz in Student Chart Skill", listOfQuiz)


    //Search the skill level of each quiz
    let skillLevelArr = []
    for (let val of listOfQuiz){
      let skillLevel = data.quiz.find(f=>f.hasOwnProperty(val))[val]['skill_level']
      skillLevelArr.push(skillLevel)
    }
    console.log('Skill Level Arr', skillLevelArr)

    //Search the Skill Level for Each Quiz

    // let skillLevelArr = []
    // data.quiz.map((e,idx)=> {
    //   skillLevelArr.push(e[`quiz_${idx+1}`]['skill_level'])
    // })
    // console.log("Skill Level Arr", skillLevelArr)

    
    const getOption = () => {
        return {
            title: {
              text: "Student Skill Level on All Quiz",
              x: "center",
              textStyle : {
                fontWeight : 'lighter', 
                fontFamily:'Helvetica',
                fontSize: 18
              }
            },
            color: ["#00ffff"],
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
              },
            },
            grid: {
              left: "12%",
              right: "20%",
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
                name : 'Quiz',
               
              }
            ],
            yAxis: [
              {
                type: "value",
                name : 'Skill Level'
              
              }
            ],
            series: [
              {
                name: "Skill Level ",
                type: "bar",
                barWidth: "50%",
                data: skillLevelArr
              
              }
            ]
          };
        }
    
    return (
        /* <div>
            <ReactEcharts option={getOption()}
        className={classes.style}/>
        </div> */

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

export default StudentChartSkillLevel

