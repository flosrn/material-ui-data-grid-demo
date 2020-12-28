import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      marginBottom: 50,
      "& > .MuiPaper-root": {
        width: "100%",
        height: theme.spacing(10),
        display: "flex",
        alignItems: "center",
        "& > * ": {
          textDecoration: "none",
        },
      },
    },
    paper: {
      boxShadow: "rgba(89, 98, 115, 0.2) 1px 0 10px 0",
    },
    logo: {
      fontFamily: "'Baloo', sans-serif",
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
      <Paper className={classes.paper} elevation={0} square>
        <Link to="/">
          <div className={classes.logo}>Sharework</div>
        </Link>
      </Paper>
    </div>
  );
};

export default Header;
