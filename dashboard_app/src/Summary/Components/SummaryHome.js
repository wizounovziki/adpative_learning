import React from "react";

// import "./App.css";

import {
  BrowserRouter as Router,
  HashRouter,
  Route,
  Switch,
  useRouteMatch
} from "react-router-dom";


// import Test from "./Components/Test";
// import NavBar from "./Components/NavBar";
// import SideBar from "./Components/SideBar";

// import SummaryPage from "./Components/SummaryPage";
// import Quiz from "./Components/Quiz";
// import Individual from "./Components/Individual";
// import StudentDetail from "./Components/StudentDetail";

import SummaryPage from "./SummaryPage";
import Quiz from "./Quiz";
import Individual from "./Individual";
import StudentDetail from "./StudentDetail";
import MainHome from "../../MainHome";
import NavBarSummary from "./NavBarSummary"
import QuizComponent from "./QuizComponent"

function SummaryHome() {

  return (
    <div style={{backgroundColor:'#efeff5'}}>
      <Router>
        {/* <NavBar /> */}
        <Switch>
        <Route path="/mainhome"><MainHome/></Route>
        {/* <NavBarSummary/> */}
          <Route
            exact
            path="/summary"
            render={() => {
              return (
                <React.Fragment>
                  <SummaryPage />
                </React.Fragment>
              );
            }}
          />
          {/* <Route path="/summary/quiz/:quizId"><Quiz/></Route> */}
          <Route path="/summary/quiz/:quizId" render={({match})=>{
            return (
              <>
              <QuizComponent match={match}/>
              </>
            )}}></Route>
          <Route exact path="/summary/individual"><Individual/></Route>
          <Route path="/summary/individual/:studentId"><StudentDetail/></Route>
        </Switch>
       </Router>
    </div>
  );
}

export default SummaryHome;
