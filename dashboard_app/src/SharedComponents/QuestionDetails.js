import React from 'react';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    margin: 16,
    marginTop: 32,
    marginBottom: 32,
    paddingLeft: 8,
    border: "1px solid red",
    borderRadius: 5,
    height: 330,
    fontSize: 24,
  },
  answerDisplay: {
    textAlign: 'right',
    paddingRight: 32,
    fontSize: 16
  }
})

const useStylesQ = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    margin: 4,
    marginTop: 32,
    fontSize: 18
  },
  tick: {
    color: 'green'
  }
})

function QuestionOption(props) {
  const classes = useStylesQ(props);
  const { studentAns, correctAns, option } = props;
  // console.log(props)

  return (<div className={classes.root}>
    {studentAns === option.letter && studentAns !== correctAns ? <s style={{color: "red"}}>{option.letter.toUpperCase()}: {option.ans}</s> : <span>{option.letter.toUpperCase()}: {option.ans}</span>}
    {option.letter === correctAns ? <CheckCircleIcon fontSize="small" className={classes.tick}/> : ''}<br />
  </div>)
}

function QuestionDetails(props) {
  const classes = useStyles();
  const {
    qnsNo,
    num,
    qns,
    options,
    correctAns,
    studentAns } = props;

  return (
    <div className={classes.root} hidden={qnsNo !== num}>
      <p><b>{num + 1}:</b> {qns}</p>
      <div>
        {options.map(option => <QuestionOption key={option.ans} studentAns={studentAns} correctAns={correctAns} option={option}/>)}
      </div>
      <div className={classes.answerDisplay}>Correct answer: {correctAns}</div>
    </div>
  )
}

export default QuestionDetails;