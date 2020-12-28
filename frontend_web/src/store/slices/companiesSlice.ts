import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { addVisibleAttribute } from "src/utils";

const BASE_URL = "http://localhost:3000/api/companies";

interface State {
  isLoading: boolean;
  isSuccess: boolean;
  hasErrors: boolean;
  companies: Company[];
  company: Company | null;
  totalResults: number;
}

export interface Company {
  id: string;
  name: string;
  visible?: boolean;
}

// The initial state with default values
export const initialState: State = {
  isLoading: false,
  isSuccess: false,
  hasErrors: false,
  companies: [],
  company: null,
  totalResults: 0,
};

// A slice for handling the data fetching with our three reducers (init fetching, success, failure)
const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    fetch: (state) => {
      state.isLoading = true;
    },
    fetchCompaniesSuccess: (state, { payload }) => {
      state.companies = payload.results;
      state.totalResults = payload.count;
      state.isSuccess = true;
      state.isLoading = false;
      state.hasErrors = false;
    },
    fetchCompaniesFailure: (state) => {
      state.isSuccess = false;
      state.isLoading = false;
      state.hasErrors = true;
    },
    fetchCompanySuccess: (state, { payload }) => {
      state.company = payload;
      state.isSuccess = true;
      state.isLoading = false;
      state.hasErrors = false;
    },
    fetchCompanyFailure: (state) => {
      state.isSuccess = false;
      state.isLoading = false;
      state.hasErrors = true;
    },
    updateCompaniesState: (state, { payload }) => {
      const { id } = payload;
      state.companies = state.companies.map((company: Company) =>
        company.id === id ? { ...company, visible: !company.visible } : company,
      );
    },
    clearVisibility: (state) => {
      state.companies = state.companies.map((company: Company) => {
        return { ...company, visible: true };
      });
    },
    clear: (state) => {
      state.isSuccess = false;
      state.isLoading = false;
      state.hasErrors = false;
    },
  },
});

// Three actions generated from the slice
export const {
  fetch,
  fetchCompaniesSuccess,
  fetchCompaniesFailure,
  fetchCompanySuccess,
  fetchCompanyFailure,
  updateCompaniesState,
  clearVisibility,
  clear,
} = companiesSlice.actions;

// A selector
export const companiesSelector = (state: any) => state.companies;

// The reducer
export default companiesSlice.reducer;

/**
 * Get the list of the companies in the current page
 *
 * @param {number} page - The page number
 * @param storedData
 */
export function getCompanies(page: number, storedData: string[] | undefined) {
  return async (dispatch: any) => {
    dispatch(fetch());
    try {
      const response = await axios.get(`${BASE_URL}-${page}.json`);
      const formattedData = addVisibleAttribute(response.data, storedData);
      dispatch(fetchCompaniesSuccess(formattedData));
    } catch (error) {
      dispatch(fetchCompaniesFailure());
      throw new Error(`🛑 getCompanies Request: \n ${error.response?.data}`);
    }
  };
}

/**
 * Get company by id
 *
 * @param {(string | number)} id - The id of the company
 */
export function getCompany(id: string) {
  return async (dispatch: any) => {
    dispatch(fetch());
    try {
      const response = await axios.get(`${BASE_URL}/${id}.json`);
      dispatch(fetchCompanySuccess(response.data));
    } catch (error) {
      dispatch(fetchCompaniesFailure());
      throw new Error(`🛑 getCompanies Request: \n ${error.response?.data}`);
    }
  };
}

/**
 *  Show or hide the company by id
 *
 * @param {(string | number)} id - The id of the company
 */
export function toggleCompanyVisibility(id: string | number) {
  return async (dispatch: any) => {
    dispatch(updateCompaniesState({ id }));
  };
}

/**
 * Set all companies visible
 */
export function setAllCompaniesVisible() {
  return async (dispatch: any) => {
    dispatch(clearVisibility());
  };
}

/**
 * Clear the state
 */
export function clearState() {
  return async (dispatch: any) => {
    dispatch(clear());
  };
}
