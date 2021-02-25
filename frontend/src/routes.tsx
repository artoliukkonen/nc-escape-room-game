import React from "react";
import { Route, Switch } from "react-router-dom";

import Dummy from "./containers/Dummy";
import Pass from "./containers/Pass";
import Frontpage from "./containers/Frontpage";

export default () => (
  <React.Fragment>
    <Switch>
      <Route exact path="/" component={Dummy} />
      <Route exact path="/:room" component={Frontpage} />
      <Route exact path="/:room/pass" component={Pass} />
    </Switch>
  </React.Fragment>
);
