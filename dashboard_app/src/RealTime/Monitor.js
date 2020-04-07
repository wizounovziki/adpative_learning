import React, { useEffect, useReducer } from 'react';

import { Switch, Route, Link, useRouteMatch, useHistory } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import StudentDisplay from './StudentDisplay';
import StudentDetails from './StudentDetails';
import SpotlightGraphs from './SpotlightGraphs';
import NavBarRealTime from './NavBarRealTime';
import { createColorCode } from '../utils/colorCoding';

import {mockData} from "../SharedComponents/Test";

const useStyles = makeStyles({
  bg: {
    backgroundColor: '#efeff5',
  },
  spinner: {
    width: "98vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  root: {
    // margin: 32,
    marginTop: 0,
    padding: 4,
    display: 'flex',
  },
  smallMonitor: {
    width: "70vw"
  },
  backButton: {
    borderRadius: 30,
    backgroundColor: '#999999',
    margin: 4,
    marginLeft: 32,
    padding: 4,
  },
  quizId: {
    marginLeft: 32,
    padding: 4,
  },
  studentLink: {
    margin: 32,
    position: "relative",
    // left: 900
  }
})

function studentReducer(state, action) {
  let newStudentArr = state.slice();

  switch (action.type) {
    case 'init':
      newStudentArr = action.payload;
      break;
    default:
      throw new Error("Invalid action detected");
  }
  return newStudentArr;
}

function Monitor() {
  const classes = useStyles();
  const history = useHistory();
  console.log(mockData)
  const [studentState, studentDispatch] = useReducer(studentReducer, [])
  const { path, url } = useRouteMatch();

  //Meant to call data from the backend
  useEffect(() => {
    //Enable this line to enable testing with static data (don't forget the imports)
    // studentDispatch({ type: 'init', payload: mockData })

    // Uncomment these lines to enable testing with live data
    const evtSource = new EventSource("/quiz_log");

    evtSource.addEventListener("open", function (ev) {
      console.log("Connection has opened");
    })

    evtSource.addEventListener("message", function (ev) {
      console.log("message received");
      console.log(ev.data);
      studentDispatch({ type: 'init', payload: JSON.parse(ev.data) });
    })

    evtSource.addEventListener("error", function (e) {
      console.log(e);
    })

    return (() => { 
      console.log("connection closed")
      evtSource.close()
    })

  }, [])

  return (
    studentState[0] !== undefined ? <div className={classes.bg}>
      <NavBarRealTime />
      <div className={classes.quizId}>Quiz name: {studentState[0].details.quiz_id}</div>
      <Switch>
        <Route path={`${path}/student/:studentId`}>
          <div>
            <StudentDetails
              mapColor={createColorCode(studentState[0].details.quiz_type)}
              studentState={studentState} />
            <Button className={classes.backButton} onClick={() => { history.goBack() }}>Back</Button>
          </div>
        </Route>
        <Route path={`${path}/studentlist`}>
          <div>
            <StudentDisplay
              mapColor={createColorCode(studentState[0].details.quiz_type)}
              studentState={studentState}
              showPagination={true}
              isSpotLight={false} />
            <Link to={`${url}`}>Return to Main Page</Link>
          </div>
        </Route>
        <Route path={`${path}`}>
          <div className={classes.root}>
            <div className={classes.smallMonitor}>
              <StudentDisplay
                mapColor={createColorCode(studentState[0].details.quiz_type)}
                studentState={studentState}
                showPagination={false}
                isSpotlight={true} />
              <Link to={`${url}/studentlist`} className={classes.studentLink}>See all student states...</Link>
            </div>
            <SpotlightGraphs
              mapColor={createColorCode(studentState[0].details.quiz_type)}
              studentState={studentState} />
          </div>
        </Route>
      </Switch>
    </div>
      : <div className={classes.spinner}><CircularProgress />Now Loading...</div>)
}

export default Monitor;