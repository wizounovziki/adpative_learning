import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { Button, Avatar } from "@material-ui/core";

import { useHistory, Link, useRouteMatch } from "react-router-dom";

import { emoColor } from "../../utils/colorCoding";

const useStyles = makeStyles({
  mainUnit: {
    display: "flex",
    flexDirection: "column",
    // border: "1px solid",
    width: "300px",
    height: "330px",
    margin: "1rem",
    // boxShadow: "7px 10px 12px -5px rgba(0,0,0,56)",
    borderRadius: "3px",
    alignItems: "center"
  },
  studentImage: {
    borderRadius: "50%",
    width: 185,
    height: 185,
    "&:hover": {
      cursor: "pointer"
    },
    border: "1px solid",
    borderColor: props => emoColor(props.emotion)
  },
  // borderAvatarLeft: {
  //   border: "5px solid #cdcc00 "
  // },
  // borderAvatarClosed: {
  //   border: "5px solid #ff9899 "
  // },
  // borderAvatarRight: {
  //   border: "5px solid #ffbb34"
  // },
  // borderAvatarCenter: {
  //   border: "5px solid #9900cc"
  // },
  // borderAvatarLost: {
  //   border: "5px solid #32cccc"
  // },
  margin: {
    display: "flex",
    margin: "10px"
  },
  barBase: {
    fill: "grey",
    borderRadius: "10%"
  },
  bar: {
    strokeWidth: 0,
    fill: props => emoColor(props.emotion),
    // fill: 'red',
    borderRadius: "10%"
  },
  barLeft: {
    fill: "#cdcc00"
  },
  barClosed: {
    fill: "#ff9899"
  },
  barLost: {
    fill: "#32cccc"
  },
  barRight: {
    fill: "#ffbb34"
  },
  barCenter: {
    fill: "#9900cc"
  }

  //implement style if used Student Avatar component from Shared component folder
  // avatar: {
  //   width: 185,
  //   height: 185,
  //   backgroundColor: '#c0c0c0',
  //   border: '4px solid',
  //   borderColor: props => emoColor(props.emotion),
  // },
  // statsBox: {
  //  alignSelf : 'center'
  // },
  // baseBar: {
  //   position: 'absolute',
  //   height: 15,
  //   width: 185,
  //   backgroundColor: "black",
  //   borderRadius: 5,
  // },
  // difficultyBar: {
  //   position: 'relative',
  //   height: 15,
  //   width: props => props.difficulty / 10 * 185,
  //   backgroundColor: props => emoColor(props.emotion),
  //   borderRadius: 5,
  // },
  // skillLevelBar: {
  //   position: "relative",
  //   height: 15,
  //   width: props => (props.proficiency)/5 * 185,
  //   backgroundColor: props => emoColor(props.emotion),
  //   borderRadius: 5,
  // }
});

function StudentAvatar(props) {
  const classes = useStyles(props);
  const history = useHistory();
  const { student, data, name, picture, difficulty, proficiency } = props;

  console.log("Student", student);
  console.log("Difficulty", difficulty);

  const handleDetails = id => {
    history.push(`/summary/individual/${id}`);
  };

  // let studentImageName = student["details"]["student_info"]["student_portrait"];
  // console.log("Student Avatar", studentImageName);

  // let studentLastEmotion =
  //   student["details"]["AI"][student["details"]["AI"].length - 1];
  // console.log("Student Last Emotion", studentLastEmotion);

  // let studentLastDifficultyTypeQuestion =
  //   student["details"]["difficulties"][
  //     student["details"]["difficulties"].length - 1
  //   ];
  // console.log(
  //   "Student Last Difficult Type Question",
  //   studentLastDifficultyTypeQuestion
  // );

  // let studentSkillLevel = Math.abs(student["details"]["est_theta"]).toFixed(2);
  // console.log("Student Skill Level", studentSkillLevel);

  return (
    <div className={classes.mainUnit}>
      {/* <Typography>{student.details.student_info.student_name}</Typography> */}
      {name}
      <div className={classes.margin} />
      <Avatar
        className={classes.studentImage}
        src={`/portrait/${picture}`}
        onClick={() => handleDetails(name)}
      ></Avatar>
      {/* 
    <div>
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

    </div> */}

      <svg width={200} height={90} style={{ margin: -5 }}>
        <text x={0} y={15}>
          Difficulty :{" "}
        </text>
        <rect
          width={185}
          height={15}
          x={0}
          y={20}
          rx={5}
          ry={5}
          className={classes.barBase}
        />
        <rect
          width={(difficulty / 10) * 185}
          height={15}
          x={0}
          y={20}
          rx={5}
          ry={5}
          className={classes.bar}
        />
        <text x={0} y={50}>
          Proficiency :{" "}
        </text>
        <rect
          width={185}
          height={15}
          x={0}
          y={55}
          rx={5}
          ry={5}
          className={classes.barBase}
        />
        <rect
          width={(proficiency / 5) * 185}
          height={15}
          x={0}
          y={55}
          rx={5}
          ry={5}
          className={classes.bar}
        />
      </svg>
    </div>
  );
}

export default StudentAvatar;
{
  /* <div className={classes.mainUnit}>
      <Typography>{student.name}</Typography>
      <Typography>{student.age}</Typography>
      <Button
      variant = "contained"
      color="primary"
      onClick={() => handleDetails(student.id)}> 
        More Details 
      </Button>
    </div> */
}

{
  /* 
    // <div className = {classes.margin}/>
    //   <Button
    //   variant = "contained"
    //   color="primary"
    //   onClick={() => handleDetails(student.id)}> 
    //     More Details 
    //   </Button> */
}
