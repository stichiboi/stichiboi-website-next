import styles from "./Checkbox.module.css";
import {useEffect, useState} from "react";

interface CheckboxProps {
  onToggle: (v: boolean) => unknown,
  className?: string,
  label: string,
  saveKey: string
}

export function Checkbox({onToggle, className, label, saveKey}: CheckboxProps): JSX.Element {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(saveKey);
    if (saved) {
      const value = saved === "true";
      setValue(value);
    }
  }, [saveKey]);

  useEffect(() => {
    onToggle(value);
  }, [onToggle, saveKey, value]);

  useEffect(() => {
    // call in setValue to ensure it's always the latest value
    setValue(prev => {
      localStorage.setItem(saveKey, prev.toString());
      return prev;
    });
  }, [value, saveKey]);

  return (
    <div className={`${styles.checkbox} ${className}`}>
      <input
        checked={value}
        id={label}
        name={label}
        type={"checkbox"}
        onChange={() => {
          setValue(prev => !prev)
        }}
      />
      <label htmlFor={label}>{label}</label>
    </div>
  );
}