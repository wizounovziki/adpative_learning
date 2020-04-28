import React,{useEffect, useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import StudentAvatar from "./StudentAvatar";
import { Typography } from "@material-ui/core";

import axios from "axios";

import Paper from '@material-ui/core/Paper';

import { emoColor } from "../../utils/colorCoding";


const useStyles = makeStyles(theme => ({
  mainUnit: {
    display: "flex",
    flexDirection: "column",
    // border: "1px solid",
    width: 300,
    height: 700,
    padding: "10px",
    margin: "1rem",
    borderRadius: "5px",
    alignItems: "center",
    [theme.breakpoints.between(768,968)]:{
        width : '100%',
        // backgroundColor:'green'
    },
    [theme.breakpoints.between(968,1024.5)]:{
        width : '100%'
    },
  },
  studentImage: {
    border: "1px solid",
    borderRadius: "50%",
    width: "50%",
    height: "50%",
    "&:hover": {
      cursor: "pointer"
    }
  },
  margin: {
    display: "flex",
    margin: "10px"
  },
  detailUnit : {
      display : 'flex', 
      flexWrap : 'wrap', 
      width : '100%'
  }, 
  bioData : {
    marginTop : '10px',
  }
}));

function StudentBio({ student,data,studentId}) {
  const classes = useStyles();
  const [studentList, setStudentList] = useState([])

  console.log("Data in Student Bio", data)

  console.log("Student Id in Student Bio", studentId)

  useEffect(() => {
    axios
      .get(`/student_list`)
      .then(response => {
        setStudentList(response.data);
      })
      .catch(err => console.log("Error in fetching data", err));
  },[]);

  console.log("Student List in Student Bio", studentList);

  let singleStudentData = studentList.length > 0 && studentList.find(f=>f.student_name === studentId)
  console.log("Single Student Data",singleStudentData)


  return studentList.length > 0 && (
    <Paper className={classes.mainUnit} elevation={2}>
      {/* <StudentAvatar student={student} data={data}/> */}
      <StudentAvatar
                  name={singleStudentData.student_name}
                  picture={singleStudentData.image}
                  difficulty={singleStudentData.difficulty}
                  proficiency={singleStudentData.proficiency}
                  emotion={singleStudentData.emotion}
                />
      <div className={classes.bioData}>
        <Typography className = {classes.detailUnit}>
          Current Skill Level :{" "}
          {data.skill_level}
        </Typography>
        <Typography  className = {classes.detailUnit}>Previous Skill Level : {data.pre_skill_level}</Typography>
        <div className={classes.margin} />
        <Typography className = {classes.detailUnit}>Cur. Class Rank : {data.current_class_rank}</Typography>
        <Typography className = {classes.detailUnit}>Pre.Class Rank : {data.prev_class_rank}</Typography>
        <div className={classes.margin} />
        <Typography className = {classes.detailUnit}>Strong Areas : {data.strong_areas}</Typography>
        <div className={classes.margin} />
        Improvement Areas : {data.improvements}
      </div>
    </Paper>
  );
}

export default StudentBio;
