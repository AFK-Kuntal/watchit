import { useState, useEffect } from "react";

export function useLocalStorage(initialState, key) {
  const [watched, setWatched] = useState(() => {
    const values = JSON.parse(localStorage.getItem(key));
    return values ? values : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(watched));
  }, [key, watched]);

  return [watched, setWatched];
}
