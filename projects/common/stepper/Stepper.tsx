import React, {ReactNode, useCallback, useEffect} from "react";
import styles from "./Stepper.module.css";
import {Minus, Plus} from "iconoir-react";
import {useStateLocalStorage} from "../hooks/useStateLocalStorage";

interface StepperProps {
    label?: string,
    explanation?: string,
    defaultValue: number,
    saveKey: string,
    onChange: (value: number) => void,
    min?: number,
    max?: number,
    stepSize?: number,
    leftIcon?: ReactNode,
    rightIcon?: ReactNode,
    displayValue?: (_: number) => string
}

export function Stepper({
  label,
  explanation,
  defaultValue,
  saveKey,
  onChange,
  min = 0,
  max = 10,
  stepSize = 1,
  leftIcon = <Minus/>,
  rightIcon = <Plus/>,
  displayValue
}: StepperProps) {

  const [value, setValue] = useStateLocalStorage(defaultValue, saveKey);

  useEffect(() => {
    onChange(value);
  }, [onChange, saveKey, value]);

  const updateValue = useCallback((modifier: number) => {
    setValue(prev => {
      if (prev === undefined) {
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
      {explanation ? <em>{explanation}</em> : null}
      <div className={styles.stepper}>
        <button onClick={() => updateValue(-stepSize)}>
          {leftIcon}
        </button>
        <p>{(displayValue && value !== undefined) ? displayValue(value) : value}</p>
        <button onClick={() => updateValue(stepSize)}>
          {rightIcon}
        </button>
      </div>
    </div>
  )
}
