import React from 'react';

import { makeStyles } from '@material-ui/core';

import Rating from '@material-ui/lab/Rating';

// import { emoColor } from '../utils/colorCoding';

// const emotions = ['Left', 'Right', 'Center', 'Closed', 'Lost'];
const difficulties = ['Beginner', 'Easier', 'Difficult', 'Advanced', 'Expert']

const useStylesR = makeStyles({
  root: {
    margin: 16,
    padding: 4,
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
  },
})

const useStyles1 = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
  },
  indicator: {
    display: "inline-block",
    width: 12,
    height: 12,
    marginLeft: 4,
    borderRadius: "50%",
    backgroundColor: props => props.mapColor(props.emotionString)
  }
})

const useStyles2 = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
  }
})

const useStyles3 = makeStyles({
  root: {
    height: 60,
    fontSize: 14,
    display: 'flex',
    flexDirection: "column",
    justifyContent: "space-between"
  }
})

function EmotionIndicator(props) {
  const classes = useStyles1(props)

  return (
    <span className={classes.root}>
      {props.emotionString + ' '}
      <div className={classes.indicator}></div>
      {" "}
    </span>
  )
}

function DifficultyIndicator({ difficulty, value, max }) {
  const classes = useStyles2();

  return (
    <span className={classes.root}>
      {difficulty + " "}
      <Rating readOnly size='small' value={value} max={max} className={classes.rating}/>
      {" "}
    </span>
  )
}

function LegendBox({ top, bottom }) {
  const classes=useStyles3();
  return (
    <div className={classes.root}>
      {top}
      <br />
      {bottom}
    </div>
  )
}

function Legend(props) {
  const classes = useStylesR(props);
  const { tags, mapColor } = props

  return (
    <div className={classes.root}>
      <LegendBox top={<span>Anxiety Level </span>} bottom={<span>Difficulty Level </span>} />
      {difficulties.map((diff, idx) => {
        return (
          <LegendBox
            key={diff}
            top={idx < tags.length ? <EmotionIndicator emotionString={tags[idx]} mapColor={mapColor} /> : ""}
            bottom={<DifficultyIndicator difficulty={diff} value={idx + 1} max={idx + 1} />} />
        )
      })}
    </div>
  )
}

export default Legend;