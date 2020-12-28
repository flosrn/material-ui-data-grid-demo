import { Company } from "src/store/slices/companiesSlice";

interface Response {
  count: number;
  has_more: boolean;
  page: number;
  results: Company[];
}

/**
 * Format companies with the new visible attribute
 *
 * @param {Object[]} results - the array of companies
 * @param {boolean} isVisible - visibility
 */
const formatResults = (results: Company[], isVisible: boolean) =>
  results.map((company: Company) => ({ ...company, visible: isVisible }));

/**
 * Add visible attribute to the companies list
 *
 * @param {Object} responseData - The Async response
 */
export const addVisibleAttribute = (responseData: Response) => {
  const persistentData: string | null = localStorage.getItem("hiddenCompanies");
  const parsedData = persistentData && JSON.parse(persistentData);
  // If no persisted data, return the companies list with the new visibility attribute set to true
  if (!parsedData) {
    return {
      ...responseData,
      results: formatResults(responseData.results, true),
    };
  }
  const filtering = (companies: Company[], filter: any) => {
    let hiddenCompanies: Company[] = [];
    let visibleCompanies: Company[] = [];
    companies.forEach((company: Company, index: number, arr: any) =>
      (filter(company, index, arr) ? hiddenCompanies : visibleCompanies).push(company),
    );
    return [hiddenCompanies, visibleCompanies];
  };
  // Filter companies in two arrays, one for visible companies, the other one for hidden companies
  const [hiddenCompanies, visibleCompanies] = filtering(responseData.results, (company: Company) =>
    parsedData.includes(company.id),
  );
  return {
    ...responseData,
    results: [...formatResults(hiddenCompanies, false), ...formatResults(visibleCompanies, true)],
  };
};

/**
 * Add or remove the company id to local storage
 *
 * @param {(string | null)} persistentHiddenCompanies - The list of the hidden companies
 * @param {string | number} id - The id of the company
 */
export const returnPersistent = (persistentHiddenCompanies: string | null, id: string | number) => {
  if (persistentHiddenCompanies) {
    let array = JSON.parse(persistentHiddenCompanies);
    if (array.includes(id)) {
      const index = array.indexOf(id);
      array.splice(index, 1);
      return JSON.stringify(array);
    } else {
      array.push(id.toString());
      return JSON.stringify(array);
    }
  }
  return JSON.stringify([id]);
};
