import { useEffect } from "react";

export function useKeyPress(key, callback) {
  useEffect(() => {
    const action = (e) => {
      if (e.code.toLowerCase() === key.toLowerCase()) callback();
    };

    document.addEventListener("keydown", action);

    return () => document.removeEventListener("keydown", action);
  }, [callback, key]);
}
