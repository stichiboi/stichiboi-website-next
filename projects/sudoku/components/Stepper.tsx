import React, { useCallback, useEffect, useState } from "react";
import { DIFFICULTY } from "../types/types";
import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import styles from "../styles/Stepper.module.css";

interface StepperProps {
  label: string,
  saveKey: string,
  onChange: (value: number) => void,
  min?: number,
  max?: number
}

export function Stepper({
  label,
  saveKey,
  onChange,
  min,
  max
}: StepperProps) {

  const [value, setValue] = useState(0);
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
      <h3>{label}</h3>
      <div className={styles.stepper}>
        <button onClick={() => changeTriesCount(-1)}>
          <NavArrowLeft/>
        </button>
        <p>{DIFFICULTY[value]}</p>
        <button onClick={() => changeTriesCount(1)}>
          <NavArrowRight/>
        </button>
      </div>
    </div>
  )
}
