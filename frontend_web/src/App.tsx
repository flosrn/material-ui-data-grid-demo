import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import rootReducer from "src/store";
import Header from "src/components/header";
import Companies from "src/views/companies";
import Company from "src/views/company";
import "./App.css";

const store = configureStore({
  reducer: rootReducer,
});

export const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <Redirect to="/companies?page=1" />
          </Route>
          <Route exact path="/companies" component={Companies} />
          <Route path="/companies/:id" component={Company} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
