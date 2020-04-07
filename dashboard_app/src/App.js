import React from 'react';

import { Route, Switch } from "react-router-dom"

import MainHome from "./MainHome";
import Monitor from "./RealTime/Monitor";
import SummaryHome from "./Summary/Components/SummaryHome";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/monitor">
          <Monitor />
        </Route>
        <Route path="/summary">
          <SummaryHome />
        </Route>
        <Route path="/">
          <MainHome />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
