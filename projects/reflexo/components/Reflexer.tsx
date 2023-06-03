import { useCallback, useEffect, useState } from "react";
import { ResultType } from "../types/types";
import styles from "../styles/Reflexer.module.css";

const FILL_COLORS = [
  'FF595E',
  '1982C4',
  '6A4C93',
  'FFCA3A'
];

const VALID_COLORS = [
  '8AC926'
];

const TIME_RANGE = {
  start: 1000,
  end: 5000
}

interface ReflexerProps {
  isRunning: boolean,
  onResult: (result: ResultType) => void
}

export function Reflexer({
  isRunning,
  onResult
}: ReflexerProps) {
  const getColor = useCallback((target: string[]) => {
    const ind = Math.floor(Math.random() * target.length);
    return `#${target[ind]}`;
  }, []);

  const [color, setColor] = useState(getColor(FILL_COLORS));
  const [timeoutId, setTimeoutId] = useState(0);
  const [validTime, setValidTime] = useState<undefined | number>();

  useEffect(() => {
    setTimeoutId(prev => {
      if (isRunning && !validTime) {
        if (prev) {
          clearTimeout(prev);
          setColor(getColor(FILL_COLORS));
        }
        const time = Math.random() * (TIME_RANGE.end - TIME_RANGE.start) + TIME_RANGE.start;
        return setTimeout(() => {
          setColor(getColor(VALID_COLORS));
          setValidTime(Date.now());
        }, time) as unknown as number;
      } else if (!isRunning) {
        clearTimeout(prev);
        return 0;
      }
      return prev;
    });
  }, [getColor, isRunning, validTime]);


  function registerEvent() {
    if (isRunning) {
      const result = validTime ? Date.now() - validTime : "Invalid result";
      onResult(result);
      setValidTime(undefined);
    }
  }

  return (
    <div
      className={styles.reflexer}
      style={{ backgroundColor: color }}
      onMouseDown={registerEvent}
      onKeyDown={registerEvent}
    />
  )
}