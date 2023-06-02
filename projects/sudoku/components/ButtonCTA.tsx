import { ReactNode } from "react";
import styles from "../styles/ButtonCTA.module.css";

interface ButtonCTAProps {
  onClick: () => unknown,
  children: ReactNode
}

export function ButtonCTA({onClick, children}: ButtonCTAProps): JSX.Element {
  return (
    <button className={styles.buttonCta} onClick={onClick}>
      {children}
    </button>
  );
}