import {ReactNode} from "react";
import styles from "./ButtonCTA.module.css";

interface ButtonCTAProps {
  onClick: () => unknown,
  className?: string,
  children: ReactNode
}

export function ButtonCTA({onClick, className, children}: ButtonCTAProps): JSX.Element {
  return (
    <button className={`${styles.buttonCta} ${className || ""}`} onClick={onClick}>
      {children}
    </button>
  );
}