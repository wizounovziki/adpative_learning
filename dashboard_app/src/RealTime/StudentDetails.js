import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';

import StudentAvatar from '../SharedComponents/StudentAvatar';
import QuestionDisplay from './QuestionDisplay';
import Legend from '../SharedComponents/Legend';
import StudentDetailsGraph from './StudentDetailsGraph';

// import { sampleQnsSet1, studentData } from './resources/testData';

const useStyles = makeStyles({
  spinner: {
    width: "100vw",
    height: "100vh",
    display: "flex",
  },
  root: {
    display: 'flex',
  },
  questionDisplay: {
    marginRight: 32,
    padding: 4,
    maxWidth: "45vw",
    display: "flex",
    flexDirection: "column",
  },
  student: {
    marginLeft: 32,
    marginRight: 32,
    paddingRight: 12,
    paddingLeft: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 300,
  },
  studentBioData: {
    marginLeft: 56,
    alignSelf: "flex-start"
  }
})

function StudentDetails(props) {
  const classes = useStyles();
  const { studentId } = useParams();
  const { studentState, mapColor } = props;
  // console.log(props);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (studentState.length !== 0) {
      setStudent(studentState.find((student) => student.details.student_id === studentId))
    }
  }, [studentState, studentId])

  return (student ?
    <div className={classes.root}>
      <Paper className={classes.student}>
        <StudentAvatar
          mapColor={mapColor}
          name={student.details.student_info.student_name}
          picture={student.details.student_info.student_portrait}
          emotion={student.details.AI[student.details.AI.length - 1]}
          difficulty={student.details.difficulties[student.details.difficulties.length - 1]}
          skillLevel={student.details.est_theta} />
        <div className={classes.studentBioData}>
          <p>Current Skill level: {student.details.est_theta} <br />  
          Previous Skill level: {/*student.skillLevel.previous*/}</p>
          <p>Current Rank: {/*student.rank.current*/}< br/>
          Previous Rank: {/*student.rank.previous*/}</p>
          <p>Strong Areas: <br />
          {/* <p>{student.competencies.join(", ")}</p> */}
          Weaknesses:</p>
          {/* <p>{student.weaknesses.join(", ")}</p> */}
        </div>
      </Paper>
      <Paper className={classes.questionDisplay}>
        <QuestionDisplay student={student} mapColor={mapColor} />
        <Legend mapColor={mapColor} tags={student.details.quiz_type} />
      </Paper>
      <Paper><StudentDetailsGraph qnsList={student} /></Paper>
    </div>
    : <div className={classes.spinner}><CircularProgress />Now Loading...</div>
  )
}

export default StudentDetails;