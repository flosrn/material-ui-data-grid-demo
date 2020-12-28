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
 * @param {Object[]} results - The array of companies
 * @param {boolean} isVisible - Determine if the company is visible or hidden
 */
const formatResults = (results: Company[], isVisible: boolean) =>
  results.map((company: Company) => ({ ...company, visible: isVisible }));

/**
 * Filter companies in two arrays, one for visible companies, the other one for hidden companies
 *
 * @param {Object[]} companies - The array of companies
 * @param {(Object, number, Object[]) => boolean} filter - Apply the filter method on each element
 */
const filtering = (
  companies: Company[],
  filter: (company: Company, index: number, companies: Company[]) => boolean,
) => {
  let hiddenCompanies: Company[] = [];
  let visibleCompanies: Company[] = [];
  companies.forEach((company: Company, index: number, companies: Company[]) =>
    (filter(company, index, companies) ? hiddenCompanies : visibleCompanies).push(company),
  );
  hiddenCompanies = formatResults(hiddenCompanies, false);
  visibleCompanies = formatResults(visibleCompanies, true);
  return [...hiddenCompanies, ...visibleCompanies];
};

/**
 * Add visible attribute to the companies list
 *
 * @param {Object} responseData - The Async response
 * @param {(string[] | undefined)} storedData - The local storage data
 */
export const addVisibleAttribute = (responseData: Response, storedData: string[] | undefined) => {
  return {
    ...responseData,
    results:
      storedData && storedData.length > 0
        ? filtering(responseData.results, (company: Company) => storedData.includes(company.id))
        : formatResults(responseData.results, true),
  };
};

/**
 * Update the local storage array of company id
 *
 * 1) If the id is already in the array
 *     remove it
 * 2) If the id isn't in array
 *     add it
 *
 * @param {any} storedData - The previous data from local storage (The list of the hidden companies)
 * @param {string} id - The id of the company
 */
export const updateArray = (storedData: any, id: string) => {
  if (storedData.includes(id)) {
    // This means id is present in the array, so remove it
    const index = storedData.indexOf(id);
    storedData.splice(index, 1);
  } else {
    // This means id is not present in the array, so add it
    storedData.push(id.toString());
  }
  return storedData;
};
