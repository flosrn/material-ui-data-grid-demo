import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      "& > .MuiPaper-root": {
        width: "100%",
        height: theme.spacing(10),
        display: "flex",
        alignItems: "center",
      },
    },
    logo: {
      fontFamily: "'Baloo 2', cursive",
      fontWeight: 800,
      fontSize: 34,
      color: "#333333",
      cursor: "pointer",
      paddingLeft: theme.spacing(8),
    },
  }),
);

const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Paper elevation={3} square>
        <div className={classes.logo}>Sharework</div>
      </Paper>
    </div>
  );
};

export default Header;
