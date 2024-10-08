import React, {CSSProperties, ReactNode} from "react";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  label?: ReactNode;
  percentage: number;
  absoluteValue?: number;
  className?: string;
  barClassName?: string;
  tooltip?: string;
  hideOnZero?: boolean;
}

export function ProgressBar({
                              label,
                              percentage,
                              absoluteValue,
                              className,
                              barClassName,
                              tooltip,
                              hideOnZero = true
                            }: ProgressBarProps): JSX.Element {
  return (
    <div
      title={tooltip}
      className={`${styles.container} ${className || ""}`}
      style={{
        "--percentage": percentage,
      } as CSSProperties}
    >
      {label}
      {!hideOnZero || percentage ?
        <div className={`${styles.bar} ${barClassName || ""}`}>
          <strong className={styles.absoluteValue}>{absoluteValue}</strong>
        </div> : null
      }
    </div>
  );
}
