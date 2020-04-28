import React from "react";

import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";

import StudentBio from "./StudentBio";
import StudentChart from "./StudentCharts";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  mainContainer: {
    display: "flex",
    width: "100%",
    // height: "80vh",
    flexWrap: "wrap",
    [theme.breakpoints.between(768, 1024.5)]: {
      flexDirection: "column",
      justifyContent: "space-evenly",
    },
    // [theme.breakpoints.up(968)]:{
    //     backgroundColor : 'green',
    // }
  },
  chartContainer: {
    display: "flex",
    flexWrap: "wrap",
    height: "47%",
    width: "48%",
    margin: "10px",
    alignItems: "center",
    justifyContent: "space-around",
    [theme.breakpoints.between(768, 1024.5)]: {
      width: "100%"
    }
    // padding: '15px'
    //   marginBottom : '2px'
  },
  studentBio: {
    display: "flex",
    flexWrap: "wrap"
  },
  studentChart: {
    display: "flex",
    flexWrap: "wrap"
  },
  bioContainer: {
    [theme.breakpoints.between(768, 1024.5)]: {
      display: "flex",
      marginLeft: "20px",
      marginRight: "20px",
      alignItems: "center",
      justifyContent: "center",
      height: "40%"
    }
  }
}));

function StudentDetailSummary({ studentId, studentData,data }) {
  const classes = useStyles();

  const myData = studentData.find(f => f.student_id === studentId);
  console.log(`Data For Student ${studentId}`, myData);

  return  (
    <React.Fragment>
      <div className={classes.mainContainer}>
        {/* For browser */}
        <Hidden mdDown>
          <Grid container spacing={0}>
            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5}>
              <StudentBio student={myData} data={data} studentId={studentId} />
            </Grid>
            <Grid item xs={9} md={9} sm={9} lg={9}>
              <StudentChart  data={data} studentId={studentId}/>
            </Grid>
          </Grid>
        </Hidden>

        {/* For Ipad screen size */}
        <Hidden lgUp>
          <div className={classes.bioContainer}>
            <StudentBio student={myData} data={data} studentId={studentId}/>
          </div>

          <div className={classes.chartContainer}>
            <StudentChart data={data} studentId={studentId}/>
          </div>
        </Hidden>
      </div>
    </React.Fragment>
  );
}

export default StudentDetailSummary;
