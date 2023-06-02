import React, { useCallback, useEffect, useState } from "react";
import styles from "../styles/Toggle.module.css"; // Import the CSS module

interface ToggleProps {
  saveKey: string;
  onToggle: (value: boolean) => void;
  leftIcon: JSX.Element;
  rightIcon: JSX.Element;
  className?: string;
}

export function Toggle({
  saveKey,
  onToggle,
  leftIcon,
  rightIcon,
  className
}: ToggleProps): JSX.Element {
  const getValue = useCallback(() => {
    return localStorage.getItem(saveKey) === "true";
  }, [saveKey]);

  const [value, setValue] = useState(false);

  useEffect(() => setValue(getValue()), [saveKey]);

  useEffect(() => {
    localStorage.setItem(saveKey, value.toString());
    onToggle(value);
  }, [value]);

  return (
    <button
      className={`${styles.container} ${value ? styles.toggled : ""} ${className || ""}`}
      onClick={() => setValue((prev) => !prev)}
    >
      {leftIcon}
      <div className={styles.toggle}>
        <span className={styles.slider} />
      </div>
      {rightIcon}
    </button>
  );
}
