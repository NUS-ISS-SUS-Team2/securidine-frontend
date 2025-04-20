import { useEffect, useCallback, useReducer } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

/***
 * Custom hook to manage async state where the initial state includes a "loading" flag
 * and a value ([boolean, T | null]).
 * @returns A tuple containing the state [isLoading | value],
 * where isLoading indicates if the value is still being fetched or updated,
 * and a function to set the state.
 * Updater function updates the value and clears the isLoading flag.
 * Uses useReducer internally.
 */
const useAsyncState = <T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> =>
  useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;

/***
 * Asynchronously set a key-value pair in storage.
 * - web: uses sessionStorage
 * - mobile: uses Expo SecureStore
 * Handles null values to remove the key from storage.
 */
export const setStorageItemAsync = async (
  key: string,
  value: string | null
) => {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, value);
      }
    } catch (error) {
      console.error("Session storage is unavailable", error);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
};

/***
 * Custom hook to manage a state value in storage.
 * @param key The key to store the value in
 * @returns A tuple containing the state value ([isLoading, value]) and
 * a function to set the state value.
 */
export const useStorageState = (key: string): UseStateHook<string> => {
  const [state, setState] = useAsyncState<string>();

  // Get the value from storage
  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        if (typeof sessionStorage !== "undefined") {
          setState(sessionStorage.getItem(key));
        }
      } catch (error) {
        console.error("Session storage is unavailable", error);
      }
    } else {
      SecureStore.getItemAsync(key).then((value) => {
        setState(value);
      });
    }
  }, [key]);

  // Set the value to storage
  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
};
