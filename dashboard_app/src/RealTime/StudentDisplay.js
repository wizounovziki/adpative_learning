import React, { useState, useEffect } from 'react';

import { Link } from "react-router-dom";

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import StudentAvatar from '../SharedComponents/StudentAvatar';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    marginTop: 0,
    marginBottom: 16,
    margin: 32,
  },
  displayArea: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: props => props.isSpotlight ? "space-around" : "flex-start" ,
    // maxWidth: "92vw",
    minHeight: "68vh",
  },
  // happy: {
  //   backgroundColor: emoColor('Left')  //Find a better way to do this
  // },
  // normal: {
  //   backgroundColor: emoColor('Right')
  // },
  // distracted: {
  //   backgroundColor: emoColor('Center')
  // },
  // tired: {
  //   backgroundColor: emoColor('Closed')
  // },
  // stressed: {
  //   backgroundColor: emoColor('Lost')
  // },
  all: {
    backgroundColor: '#c0c0c0',
    width: 120,
  }
})

function filterList(array, emotionFilter) {
  let arr = array.slice();
  if (emotionFilter !== '') {
    arr = arr.filter((student) => { return (student.details.AI[student.details.AI.length - 1] === emotionFilter) })
  }
  return arr;
}

function StudentDisplay(props) {
  const { studentState, showPagination, isSpotlight, mapColor } = props;
  const classes = useStyles(props);

  const [emotionFilter, setEmotionFilter] = useState('');

  const [currentData, setCurrentData] = useState(studentState);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesShown = isSpotlight ? 8 : 12;  //Number of students to display per page, estimated
  const [maxPage, setMaxPage] = useState(Math.ceil(studentState.length / entriesShown));

  useEffect(() => {
    let arr = filterList(studentState, emotionFilter)
    setCurrentData(arr.slice((currentPage - 1) * entriesShown, currentPage * entriesShown))
    setMaxPage(Math.ceil(arr.length / entriesShown));
  }, [studentState, currentPage, emotionFilter, entriesShown])


  function changeFilter(str) {
    setEmotionFilter(str);
    setCurrentPage(1);
  }

  function changePage(newPage) {
    setCurrentPage(newPage)
  }

  return (
    <div className={classes.root}>
      <div>
        {studentState[0].details.quiz_type.map((str) => {
          return(
          <Button key={str} style={{backgroundColor: mapColor(str), width: 120}} onClick={() => changeFilter(str)}>{str}</Button>
          )
        })}
        <Button className={classes.all} onClick={() => { changeFilter('') }}>all</Button>
      </div>
      <Paper className={classes.displayArea}>
        {currentData
          .map((student => {
            return (
              <Link
                key={student.student_id}
                to={{
                  pathname: `/monitor/student/${student.student_id}`,
                }}
                  style={{textDecoration: "none"}}>
                <Button>
                  <StudentAvatar
                    name={student.details.student_info.student_name}
                    picture={student.details.student_info.student_portrait}
                    emotion={student.details.AI[student.details.AI.length - 1]}
                    difficulty={student.details.difficulties[student.details.difficulties.length - 1]}
                    skillLevel={student.details.est_theta}
                    mapColor={mapColor} />
                </Button>
              </Link>
            )
          }))}
      </Paper>
      <div hidden={!showPagination}>
        <IconButton onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}><KeyboardArrowLeftIcon /></IconButton>
        Page {currentPage} of {maxPage}
        <IconButton onClick={() => changePage(currentPage + 1)} disabled={currentPage === maxPage}><KeyboardArrowRightIcon /></IconButton>
      </div>
    </div>
  )
}

export default StudentDisplay;