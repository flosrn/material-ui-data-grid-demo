import { useState } from "react";
import { updateArray } from "src/lib";

/**
 * Custom useLocaleStorage Hook
 *
 * @param {string} key - The local storage item key
 * @param {string} initialValue - The local storage initial value
 */
export default function useLocalStorage(key: string, initialValue: string) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value: string, storedData?: string | string[]) => {
    let valueToStore;
    try {
      // If no args
      if (!value && !storedData) {
        setStoredValue("[]");
        // Remove local storage and return
        return window.localStorage.removeItem(key);
        // If the data in local storage is an empty array
      } else if (storedData === "[]") {
        // The value to store with the new company id in array
        valueToStore = [value];
        // If the data in local storage is an array, it means that it processes the list of hidden companies
      } else if (storedData && storedData.length > 0) {
        // The new value to store with the added or removed company id
        valueToStore = updateArray(storedData, value);
        // If the data in local storage isn't an array
      } else {
        // The value to store is simply the initial value
        valueToStore = value;
      }
      // Save valueToStore in the state
      setStoredValue(valueToStore);
      // Save valueToStore in the local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Log the error
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
