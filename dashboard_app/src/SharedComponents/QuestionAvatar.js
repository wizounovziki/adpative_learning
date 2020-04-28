import React from 'react';

import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core';

import { emoColor } from "../utils/colorCoding";

const useStyles = makeStyles({
  question: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly', //Not supported by Edge and IE
    width: 106,
    height: 162,
    borderRadius: 5,
    backgroundColor: props => props.isSelected ? "#ED6767" : "#d9d9d9",
  },
  ratingBase: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', //Not supported by Edge and IE
    width: 98,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
  emotionBar: {
    width: 106,
    height: 14,
    borderRadius: 5,
    marginTop: 4,
    backgroundColor: props => props.mapColor(props.respEmotion)
  }
})

function QuestionAvatar(props) {
  const classes = useStyles(props);
  const { num, difficultyRating, respTime } = props;

  return (
    <div>
      <div className={classes.question}>
        <div>{respTime + " seconds"}</div>
        <div><b>{`Q ${num + 1}`}</b></div>
        <div className={classes.ratingBase}>
          <Rating readOnly value={difficultyRating / 2.0} precision={0.5} size="small" />
        </div>
      </div>
      <div className={classes.emotionBar}></div>
    </div >)
}

export default QuestionAvatar;