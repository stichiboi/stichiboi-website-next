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

  const [value, setValue] = useState<number>();
  useEffect(() => {
    const saved = localStorage.getItem(saveKey);
    if (saved) {
      const value = parseInt(saved);
      if (!isNaN(value)) {
        setValue(value);
      }
    }
  }, [saveKey]);

  useEffect(() => {
    if (value !== undefined) {
      localStorage.setItem(saveKey, value.toString());
      onChange(value);
    }
  }, [onChange, saveKey, value]);
  const updateValue = useCallback((modifier: -1 | 1) => {
    setValue(prev =>{
      if(!prev){
        // return middle between max and min
        return (max + min) / 2;
      }
      const tempValue = prev + modifier;
      // clip the value between max and min
      return Math.min(max, Math.max(min, tempValue));
    })
  }, [max, min]);

  return (
    <div className={styles.container}>
      {label ? <h3>{label}</h3> : null}
      <div className={styles.stepper}>
        <button onClick={() => updateValue(-1)}>
          {leftIcon}
        </button>
        <p>{(displayValue && value) ? displayValue(value) : value}</p>
        <button onClick={() => updateValue(1)}>
          {rightIcon}
        </button>
      </div>
    </div>
  )
}
