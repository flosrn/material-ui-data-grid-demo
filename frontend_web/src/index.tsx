import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import rootReducer from "src/store";
import * as serviceWorker from "./serviceWorker";
import Header from "src/components/header";
import Companies from "src/views/companies";
import Company from "src/views/company";
import "./index.css";

const store = configureStore({
  reducer: rootReducer,
});

const theme = createMuiTheme({
  typography: {
    fontFamily: "'Lato', sans-serif",
  },
});

const render = async (): Promise<void> => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root"),
  );
};

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
