import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Avatar, CircularProgress, Typography, IconButton, Icon, Grid } from "@material-ui/core";
import { grey, red, blue, yellow, orange, green, purple } from "@material-ui/core/colors";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { clearState, companiesSelector, getCompany, toggleCompanyVisibility } from "src/store/slices/companiesSlice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    cardWrapper: {
      width: 400,
      padding: "40px 30px",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 30,
    },
    cardIconsWrapper: {
      display: "flex",
      alignItems: "center",
      "& > * ": {
        paddingLeft: 10,
      },
      "& span": {
        fontWeight: "bold",
      },
    },
    companyName: {
      paddingBottom: 20,
      fontWeight: 600,
    },
    cardContent: {
      "& .MuiTypography-root": {
        paddingBottom: 5,
        "& > span, & a": {
          color: grey[500],
        },
      },
    },
    visibilityWrapper: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    grey: {
      backgroundColor: grey[500],
    },
    red: {
      backgroundColor: red[500],
    },
    blue: {
      backgroundColor: blue[500],
    },
    yellow: {
      backgroundColor: yellow[500],
    },
    orange: {
      backgroundColor: orange[500],
    },
    green: {
      backgroundColor: green[500],
    },
    purple: {
      backgroundColor: purple[500],
    },
  }),
);

// An array of colors
const colors = ["grey", "red", "blue", "yellow", "orange", "green", "purple"] as const;
// An array of icons
const icons = ["build", "anchor", "fingerprint", "privacy_tip", "room", "pets", "outbond"] as const;

// Return a random index from array
const getRandomIndex = (array: any) => {
  return Math.floor(Math.random() * array.length);
};

interface ParamTypes {
  id: string;
}

const Company: React.FC = () => {
  let { id } = useParams<ParamTypes>();
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { company, isLoading, isSuccess, hasErrors } = useSelector(companiesSelector);
  const [isVisible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    clearState();
  }, []);

  useEffect(() => {
    const persistentData: string | null = localStorage.getItem("hiddenCompanies");
    const parsedData = persistentData && JSON.parse(persistentData);
    setVisible(!parsedData.includes(id));
  }, [id]);

  useEffect(() => {
    let active = true;
    (async () => {
      await dispatch(getCompany(id));
      if (!active) {
        return;
      }
    })();
    return () => {
      active = false;
    };
  }, [id, dispatch]);

  const handleClick = () => {
    setVisible(!isVisible);
    dispatch(toggleCompanyVisibility(id));
  };

  const { id: companyId, name, website, city } = company || {};
  return (
    <div className={classes.root}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBackIosIcon />
          </IconButton>
          {isSuccess && !hasErrors ? (
            <Card className={classes.cardWrapper}>
              <div className={classes.cardHeader}>
                <Avatar className={classes[colors[getRandomIndex(colors)]]}>
                  {<Icon>{icons[getRandomIndex(icons)]}</Icon>}
                </Avatar>
                <div className={classes.cardIconsWrapper}>
                  <div>
                    status:{" "}
                    {isVisible ? (
                      <span style={{ color: "green" }}>visible</span>
                    ) : (
                      <span style={{ color: "red" }}>hidden</span>
                    )}
                  </div>
                  <div>
                    id: <span>{companyId}</span>
                  </div>
                  <BusinessCenterIcon />
                  <AccountCircleIcon />
                </div>
              </div>
              <Typography variant="h5" className={classes.companyName}>
                {name}
              </Typography>
              <Grid container className={classes.cardContent}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    website: <span>{website ? <a href={website}>{website}</a> : "not specified"}</span>
                  </Typography>
                  <Typography variant="subtitle1">
                    city: <span>{city || "not specified"}</span>
                  </Typography>
                </Grid>
                <Grid item xs={6} className={classes.visibilityWrapper}>
                  <IconButton onClick={handleClick}>
                    {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </Grid>
              </Grid>
            </Card>
          ) : (
            <div>This company doesn't exist</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Company;
