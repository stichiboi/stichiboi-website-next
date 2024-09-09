import React, {CSSProperties, useMemo} from "react";
import styles from "./DigitWheel.module.css";

interface DigitWheelProps {
  value: number;
  className?: string;
}

export function DigitWheel({value, className = ""}: DigitWheelProps): JSX.Element {

  const numbers = useMemo(() => {
    return Array.from({length: 10}).map((_, i) => {
      return <p key={i} style={{
        "--index": i
      } as CSSProperties}>{i}</p>
    })
  }, []);
  return (
    <div
      className={`${styles.container} ${className}`}
      style={{
        "--value": value
      } as CSSProperties}
    >
      <div className={styles.numbers}>
        {numbers}
      </div>
    </div>
  );
}
