import React from 'react'

import { makeStyles } from "@material-ui/core/styles";

import { Typography } from '@material-ui/core';


const useStyles = makeStyles({
    mainUnit: {
      display : 'flex',
      flexDirection:'column',
      border: "1px solid",
      width: "300px",
      height: "80vh",
      padding: "5px",
      margin: "1rem",
      boxShadow: "7px 10px 12px -5px rgba(0,0,0,56)",
      borderRadius: "3px",
      alignItems : 'center'
    },
    studentImage : {
      border : '1px solid',
      borderRadius : '50%',
      width : '50%',
      height:  '50%',
      "&:hover" : {
  cursor : 'pointer'
      }
    },
    margin: {
      display: "flex",
      margin: '10px'
    },
    recommendationContainer : {
        display : 'flex',
        flexWrap : 'wrap',
        flexDirection:'column', 
        width : '100%'
    },
    recommendationUnit : {
        display : 'flex',
        flexDirection : 'column',
        width : '100%',
        
    }
  });


function SummaryRecommendation({summaryData}) {
    const classes = useStyles()

     //Find List Of Quiz
  let myarr = [];
  summaryData.map((e, idx) => {
    myarr.push(Object.keys(e));
  });
  console.log("Object Keys", myarr);

  let listOfQuiz = myarr.reduce((result, arr) => {
    return result.concat(arr);
  });

  console.log("List Of Quiz in Summary Recommendation", listOfQuiz)

  let listOfRecommendation = []
  for(let val of listOfQuiz){
    let recommendation = summaryData.find(f=> f.hasOwnProperty(val))[val]['recommendation']
    listOfRecommendation.push(recommendation)
    
  }

  console.log("Recommendation", listOfRecommendation)

    return (
         <div>
            <h1>Recommendation :</h1>
            <p>{listOfRecommendation[listOfRecommendation.length - 1]}</p>
        </div>

    )
}

export default SummaryRecommendation
