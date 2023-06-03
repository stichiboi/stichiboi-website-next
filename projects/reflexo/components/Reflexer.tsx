import { useCallback, useEffect, useState } from "react";
import { ResultType } from "../types/types";
import styles from "../styles/Reflexer.module.css";
import { pickRandomElement } from "../utils";

const FILL_COLORS = [
  '#FF595E',
  '#1982C4',
  '#6A4C93',
  '#FFCA3A'
];

const VALID_COLORS = [
  '#8AC926'
];

const NICE = [
  "Nice!🌟", "Good job📈", "Such speed🏎️", "So fast...⛷️", "WOW!😲", "Fiuummmm!🧀"
]

const TOO_EARLY = [
  "Too early⏳",
  "Oh no😓",
  "Invalid result🤖"
];

const TIME_RANGE = {
  start: 1000,
  end: 5000
}

interface ReflexerProps {
  onResult: (result: ResultType) => void
}

export function Reflexer({
  onResult
}: ReflexerProps) {

  const [color, setColor] = useState(pickRandomElement(FILL_COLORS));
  const [_, setTimeoutId] = useState(0);
  const [validTime, setValidTime] = useState<undefined | number>();
  const [text, setText] = useState<string>();

  useEffect(() => {
    if (!validTime) {
      setTimeoutId(prev => {
        if (prev) {
          clearTimeout(prev);
          setColor(pickRandomElement(FILL_COLORS));
        }
        const time = Math.random() * (TIME_RANGE.end - TIME_RANGE.start) + TIME_RANGE.start;
        return setTimeout(() => {
          setColor(pickRandomElement(VALID_COLORS));
          setValidTime(Date.now());
        }, time) as unknown as number;
      });
    }
  }, [validTime]);

  const registerEvent = useCallback(() => {
    const result: ResultType = validTime ? Date.now() - validTime : "Invalid result";
    onResult(result);
    setValidTime(undefined);
    if (result === "Invalid result") {
      setText(pickRandomElement(TOO_EARLY));
    } else {
      setText(pickRandomElement(NICE));
    }
  }, [onResult, validTime]);

  return (
    <div
      className={styles.reflexer}
      style={{ backgroundColor: color }}
      onMouseDown={registerEvent}
      onKeyDown={registerEvent}
    >
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}