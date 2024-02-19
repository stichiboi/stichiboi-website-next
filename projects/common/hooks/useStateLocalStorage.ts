import {Dispatch, SetStateAction, useEffect, useState} from "react";

export function useStateLocalStorage<T extends (number | string | boolean)>(defaultValue: T, id: string): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const saved = localStorage.getItem(id);
    if (saved) {
      try {
        const value = JSON.parse(saved) as T;
        setValue(value);
      } catch (e) {
        // legacy code, try old method
        const asNumber = parseInt(saved);
        if (!isNaN(asNumber)) {
          setValue(asNumber as T);
        } else if (saved === "false" || saved === "true") {
          setValue((saved === "true") as T);
        }
        setValue(saved as T);
      }
    }
  }, [id]);

  useEffect(() => {
    // call in setValue to ensure it's always the latest value
    setValue(prev => {
      localStorage.setItem(id, JSON.stringify(prev));
      return prev;
    });
  }, [value, id]);
  return [value, setValue];
}