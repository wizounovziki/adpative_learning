import React from "react";

import { makeStyles } from "@material-ui/core";

import Rating from "@material-ui/lab/Rating";

import { emoColor } from "../../utils/colorCoding";

const emotions = ["Neural", "Engaged", "Distracted", "Lost"];
const difficulties = ["Beginner", "Easier", "Difficult", "Advanced", "Expert"];

const useStylesR = makeStyles({
  root: {
    margin: 1,
    padding: 1
  },
  section: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    display: "flex",
    margin: "10px"
  },
  unitLegend : {
    width : 180
  },
  unitLegendHeader:{
    width : 120
  }
});

const useStyles1 = makeStyles({
  root: {
    // display: "flex",
    // alignItems: "center",
    margin: "5px"
  },
  indicator: {
    display: "inline-block",
    width: 16,
    height: 16,
    borderRadius: "50%",
    backgroundColor: props => emoColor(props.emotionString.toLowerCase())
  },
  
});

const useStyles2 = makeStyles({
  root: {
    // display: "flex",
    // alignItems: "center",
    margin: "5px"
  }
});

function EmotionIndicator(props) {
  const classes = useStyles1(props);

  return (
    <span className={classes.root}>
      {props.emotionString + ": "}
      <div className={classes.indicator}></div>{" "}
    </span>
  );
}

function DifficultyIndicator({ difficulty, value }) {
  const classes = useStyles2();

  return (
    <span className={classes.root}>
      {difficulty + ": "}
      <Rating readOnly size="small" value={value} max={value} />{" "}
    </span>
  );
}

function Legend() {
  const classes = useStylesR();

  return (
    <div className={classes.root}>
      <div style={{ display: "flex" }}>
        <div className={classes.unitLegendHeader}>Anxiety Level : </div>
        <div style={{display : 'flex'}}>
          {" "}
          {emotions.map(emotion => {
            return <div className={classes.unitLegend}>
              <EmotionIndicator key={emotion} emotionString={emotion} />
            </div>;
          })}
        </div>
      </div>
      <div className={classes.margin} />
      <div style={{ display: "flex" }}>
        <div className={classes.unitLegendHeader}>Difficulty Level : </div>
        <div style={{display:'flex'}}>
          {difficulties.map((difficulty, index) => {
            return (
              <div className={classes.unitLegend}>
              <DifficultyIndicator
                key={difficulty}
                difficulty={difficulty}
                value={index + 1}
              />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Legend;
