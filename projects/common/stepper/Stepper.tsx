import React, { ReactNode, useCallback, useEffect, useState } from "react";
import styles from "./Stepper.module.css";

interface StepperProps {
  label?: string,
  saveKey: string,
  onChange: (value: number) => void,
  min?: number,
  max?: number,
  leftIcon: ReactNode,
  rightIcon: ReactNode,
  displayValue?: (_: number) => string
}

export function Stepper({
  label,
  saveKey,
  onChange,
  min = 0,
  max = 10,
  leftIcon,
  rightIcon,
  displayValue
}: StepperProps) {

  const [value, setValue] = useState((max + min) / 2);
  const getValue = useCallback(() => {
    return parseInt(localStorage.getItem(saveKey) || '3');
  }, [saveKey]);

  useEffect(() => {
    setValue(getValue());
  }, [getValue, saveKey]);

  useEffect(() => {
    localStorage.setItem(saveKey, value.toString());
    onChange(value);
  }, [onChange, saveKey, value]);

  const changeTriesCount = useCallback((modifier: number) => {
    setValue(prev => {
      if (min !== undefined && prev + modifier < min || max !== undefined && prev + modifier > max) {
        return prev;
      }
      return prev + modifier;
    });
  }, [max, min]);

  return (
    <div className={styles.container}>
      {label ? <h3>{label}</h3> : null}
      <div className={styles.stepper}>
        <button onClick={() => changeTriesCount(-1)}>
          {leftIcon}
        </button>
        <p>{displayValue ? displayValue(value) : value}</p>
        <button onClick={() => changeTriesCount(1)}>
          {rightIcon}
        </button>
      </div>
    </div>
  )
}
