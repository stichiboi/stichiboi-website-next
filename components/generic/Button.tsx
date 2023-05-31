import React, { ReactNode } from "react";
import styles from "../../styles/Button.module.css";

export interface ButtonProps {
    label: string,
    icon: JSX.Element,
    className?: string,
    onClick: () => unknown,
    children?: ReactNode
}

export default function Button({ label, icon, className, onClick, children }: ButtonProps): JSX.Element {
  return (
    <button onClick={onClick} className={`${styles.button} ${className}`}>
      <div className={styles.content}>
        {icon}
        <p>{label}</p>
      </div>
      {children}
    </button>
  );
}