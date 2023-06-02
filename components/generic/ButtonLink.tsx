import React, { CSSProperties, useMemo } from "react";
import styles from "../../styles/Button.module.css";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export interface ButtonProps {
  label: string,
  icon: JSX.Element,
  className?: string,
  target: string,
}

const ARROWS_COUNT = 8;

export default function ButtonLink({ label, icon, className, target }: ButtonProps): JSX.Element {

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

  const content = useMemo(() => {
    return (
      <>
        <div className={styles.gradient}/>
        <div className={styles.content}>
          {icon}
          <p>{label}</p>
        </div>
        <div className={styles.arrows}>{arrows}</div>
      </>
    );
  }, [arrows, icon, label]);

  return (
    <Link href={target} passHref className={`${styles.button} ${className || ""}`}>
      {content}
    </Link>
  );
}