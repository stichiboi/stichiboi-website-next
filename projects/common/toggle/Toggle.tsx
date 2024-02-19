import React, {useEffect} from "react";
import styles from "./Toggle.module.css";
import {useStateLocalStorage} from "../hooks/useStateLocalStorage"; // Import the CSS module

interface ToggleProps {
    saveKey: string;
    onToggle: (value: boolean) => void;
    leftIcon: JSX.Element;
    rightIcon: JSX.Element;
    className?: string;
    tooltip?: string;
}

export function Toggle({
  saveKey,
  onToggle,
  leftIcon,
  rightIcon,
  className,
  tooltip
}: ToggleProps): JSX.Element {
  const [value, setValue] = useStateLocalStorage<boolean>(false, saveKey);

  useEffect(() => {
    onToggle(value);
  }, [value, onToggle]);

  return (
    <button
      title={tooltip}
      className={`${styles.container} ${value ? styles.toggled : ""} ${className || ""}`}
      onClick={() => setValue((prev) => !prev)}
    >
      {leftIcon}
      <div className={styles.toggle}>
        <span className={styles.slider}/>
      </div>
      {rightIcon}
    </button>
  );
}
