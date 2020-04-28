import React from 'react';

import Avatar from '@material-ui/core/Avatar';

import { makeStyles } from '@material-ui/core';

// import { PICTURE_SOURCE } from "./resources/otherTestData";

const PICTURE_SOURCE = "/portrait/" //Needs a function to update the picture source

const useStyles = makeStyles({
  root: {
    width: 190,
    margin: 4,
    padding: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  nameDisplay: {
    padding: 8,
  },
  avatar: {
    width: 185,
    height: 185,
    backgroundColor: '#c0c0c0',
    border: '1px solid',
    borderColor: props => props.mapColor(props.emotion),
  },
  statsBox: {
    alignSelf: "flex-start",
    textAlign: "left"
  },
  baseBar: {
    position: 'absolute',
    height: 15,
    width: 185,
    backgroundColor: "#c0c0c0",
    borderRadius: 5,
  },
  difficultyBar: {
    position: 'relative',
    height: 15,
    width: props => props.difficulty / 10 * 185,
    backgroundColor: props => props.mapColor(props.emotion),
    borderRadius: 5,
  },
  skillLevelBar: {
    position: "relative",
    height: 15,
    width: props => (props.skillLevel + 3)/3 * 185,
    backgroundColor: props => props.mapColor(props.emotion),
    borderRadius: 5,
  }
})

function StudentAvatar(props) {
  const classes = useStyles(props);
  const { name, picture } = props;

  return (<div className={classes.root}>
    <span className={classes.nameDisplay}>{name}</span>
    <Avatar
      className={classes.avatar}
      src={picture !== '' ? PICTURE_SOURCE + picture : ''}>
      {picture !== '' ? '' : name.slice(0, 3)}
    </Avatar>
    <div className={classes.statsBox}>
      Difficulty: 
      <div>
        <div className={classes.baseBar}></div>
        <div className={classes.difficultyBar}></div>
      </div>
    </div>
    <div className={classes.statsBox}>
      Skill Level: 
      <div>
        <div className={classes.baseBar}></div>
        <div className={classes.skillLevelBar}></div>
      </div>
    </div>
  </div>)

}

export default StudentAvatar;