import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Button } from "@material-ui/core";
import { DataGrid, ColDef, PageChangeParams, CellParams, CellClassParams } from "@material-ui/data-grid";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import {
  clearState,
  companiesSelector,
  Company,
  getCompanies,
  setAllCompaniesVisible,
  toggleCompanyVisibility,
} from "src/store/slices/companiesSlice";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import useLocalStorage from "src/hooks/useLocalStorage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
    },
    visible: {},
    hidden: {
      background: "#fafafafa",
      color: "#cccccc",
    },
  }),
);

// A custom hook that builds on useLocation to parse the query string.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Companies: React.FC = () => {
  const query = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { companies, totalResults, isLoading } = useSelector(companiesSelector);
  const [page, setPage] = useState<number>(Number(query.get("page")));
  const [rows, setRows] = useState([]);
  const [storedData, setStoredData] = useLocalStorage("hiddenCompanies", "[]");
  const [filterType, setFilterType] = useLocalStorage("view", "onlyVisible");

  useEffect(() => {
    clearState();
  }, []);

  useEffect(() => {
    switch (filterType) {
      case "onlyHidden":
        return setRows(companies?.filter((company: Company) => !company.visible));
      case "onlyVisible":
        return setRows(companies?.filter((company: Company) => company.visible));
      case "all":
        return setRows(companies);
      default:
        return setRows(companies);
    }
  }, [companies, filterType]);

  useEffect(() => {
    let active = true;
    (async () => {
      await dispatch(getCompanies(page, storedData));
      if (!active) {
        return;
      }
    })();
    return () => {
      active = false;
    };
  }, [page, storedData, dispatch]);

  const handlePageChange = (params: PageChangeParams) => {
    if (params.paginationMode === "server" && params.rowCount > 0) {
      setPage(params.page);
      history.push({ pathname: "/companies", search: `?page=${params.page}` });
    }
  };

  const columns: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      description: "The company unique identifier",
      cellClassName: (params: CellClassParams) => clsx(params.row?.visible ? classes.visible : classes.hidden),
    },
    {
      field: "name",
      headerName: "Name",
      width: 500,
      description: "The company name",
      cellClassName: (params: CellClassParams) => clsx(params.row?.visible ? classes.visible : classes.hidden),
    },
    {
      field: "visible",
      headerName: "Visibility",
      description: "Button for hide or show a company from the list",
      renderCell: (params: CellParams) => (
        <IconButton
          onClick={() => {
            setStoredData(params.row.id, storedData);
            dispatch(toggleCompanyVisibility(params.row.id));
          }}
        >
          {params.value ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      ),
      cellClassName: (params: CellClassParams) => clsx(params.row?.visible ? classes.visible : classes.hidden),
    },
    {
      field: "details",
      headerName: "Details",
      description: "Button to see more information about the company",
      renderCell: (params: CellParams) => (
        <Link to={`/companies/${params.row.id}`}>
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        </Link>
      ),
      cellClassName: (params: CellClassParams) => clsx(params.row.visible ? classes.visible : classes.hidden),
    },
  ];

  return (
    <div className={classes.root}>
      {companies.length > 0 && (
        <div style={{ height: 615, width: 810 }}>
          <Button onClick={() => setFilterType("all")}>Show all</Button>
          <Button onClick={() => setFilterType("onlyHidden")}>Show only hidden</Button>
          <Button onClick={() => setFilterType("onlyVisible")}>Show only visible</Button>
          <Button
            onClick={() => {
              dispatch(setAllCompaniesVisible());
              setStoredData();
            }}
          >
            Set all visible
          </Button>
          <DataGrid
            loading={isLoading}
            columns={columns}
            rows={rows}
            page={page}
            pageSize={100}
            rowCount={totalResults}
            rowsPerPageOptions={[25, 50, 100]}
            showToolbar
            density="compact"
            paginationMode="server"
            onPageChange={handlePageChange}
            disableSelectionOnClick
          />
        </div>
      )}
    </div>
  );
};

export default Companies;
