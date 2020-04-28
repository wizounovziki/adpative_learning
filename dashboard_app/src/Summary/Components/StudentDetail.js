import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import StudentDetailSummary from "./StudentDetailSummary";
import StudentDetailQuiz from "./StudentDetailQuiz"

import {data} from "../../utils/data";
import {stdData}from "../../utils/tempStudentData"

import axios from "axios";

import NavBarSummary from "./NavBarSummary";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  main : {
    width : '100%',
    paddingTop : '64px'
  }
}));

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

console.log("MyDataInStudentDetail", data)

function StudentDetail() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { studentId } = useParams();
  const[studentData,setStudentData] = useState([]) // change back to empty array using the API call

  useEffect(() => {
    console.log("Use Effect in Student Detail is called");
    axios
      .get(`/student_details/${studentId}`) //use in office 172.29.57.17:7777
                                                                    // use in home http://ce7798df.ngrok.io/
      .then(response => {
        console.log("Response Student data", response);
        setStudentData(response.data);
      })
      .catch(err => console.log("Error in fetching data", err));
  }, [studentId]);


  
  console.log("Student Data", studentData)
  let stuData = studentData[studentId]
  console.log('StuData', stuData)
  let stuQuiz = stuData !== undefined && stuData.quiz
  console.log("Student Quiz", stuQuiz)


  //List Of Quiz for a particular student
  let keyOfQuiz = stuData !== undefined && stuQuiz.map((e,idx)=> {
      return Object.keys(e)
  })
  console.log("keyOfQuiz", keyOfQuiz)

  let listOfQuiz = stuData !== undefined && keyOfQuiz.reduce((result,arr)=>{
      return result.concat(arr)
  })
  console.log("list Of Quiz In Student Detail", listOfQuiz)


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return studentData !== undefined && stuData !== undefined ? (
      <React.Fragment>
        <NavBarSummary/>
      <div className={classes.main} >
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example"  variant="scrollable"
          scrollButtons="auto">
          {/* {...a11yProps(0)} here is to destructure whatever the function is returning   */}
          <Tab label="Summary" {...a11yProps(0)} />
          {listOfQuiz.length > 0 && listOfQuiz.map((e,idx)=> (
            <Tab label={e} {...a11yProps(idx+1)} key={idx} />
            ))}
          {/* <Tab label="Quiz 2" {...a11yProps(2)} /> */}
        </Tabs>
      </AppBar>
      </div>
      <TabPanel value={value} index={0}>
        <StudentDetailSummary studentId={studentId} studentData={data} data={stuData}/>
      </TabPanel>
      {listOfQuiz.length > 0 && listOfQuiz.map((e,idx)=> (
        <TabPanel value={value} index={idx+1} key={idx}>
        <StudentDetailQuiz studentId={studentId} studentData={data} data={stuData} quizId={e}/>
      </TabPanel>
      ))}

      </React.Fragment>
    
  ) : (" ");
}

export default StudentDetail;
