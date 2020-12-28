import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import rootReducer from "src/store";
import Header from "src/components/header";
import Companies from "src/views/companies";
import Company from "src/views/company";

const store = configureStore({
  reducer: rootReducer,
});

const theme = createMuiTheme({
  typography: {
    fontFamily: "'Lato', sans-serif",
  },
});

export const App = () => {
  return (
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
  );
};

export default App;
