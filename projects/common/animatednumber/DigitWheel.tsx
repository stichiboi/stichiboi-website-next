import React, {CSSProperties, useMemo} from "react";
import styles from "./DigitWheel.module.css";

interface DigitWheelProps {
  value: number
}

export function DigitWheel({value}: DigitWheelProps): JSX.Element {

  const numbers = useMemo(() => {
    return Array.from({length: 10}).map((_, i) => {
      return <p key={i} style={{
        "--index": i
      } as CSSProperties}>{i}</p>
    })
  }, []);
  return (
    <div className={styles.container} style={{
      "--value": value
    } as CSSProperties}>
      <div className={styles.numbers}>
        {numbers}
      </div>
    </div>
  );
}
