import React, { CSSProperties } from "react";
import styles from "../../styles/Button.module.css";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface ButtonProps {
  label: string,
  icon: JSX.Element,
  className?: string,
  onClick: () => unknown,
}

const ARROWS_COUNT = 8;

export default function Button({ label, icon, className, onClick }: ButtonProps): JSX.Element {

  const arrows = Array.from({ length: ARROWS_COUNT }).map((_, i) => {
    return (
      <FontAwesomeIcon
        size={"lg"}
        className={styles.arrow}
        style={{
          "--delay": Math.log(i + 1),
          "--opacity": 1 / (i + 1),
        } as unknown as CSSProperties}
        key={i}
        icon={faChevronRight}
      />
    );
  });

  return (
    <button onClick={onClick} className={`${styles.button} ${className || ""}`}>
      <div className={styles.gradient}/>
      <div className={styles.content}>
        {icon}
        <p>{label}</p>
      </div>
      <div className={styles.arrows}>{arrows}</div>
    </button>
  );
}