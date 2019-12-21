import React from "react";

import { Route, Switch } from "react-router-dom";
//components
import HomeLanding from "./components/pages/HomeLanding";
import Game from "./components/pages/Game";
import Register from "./components/pages/Register";

export default (
  <Switch>
    <Route path="/game/:roomID" component={Game} />
    <Route exact path="/" component={HomeLanding} />
  </Switch>
);
