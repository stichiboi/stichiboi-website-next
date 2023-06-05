import React, {CSSProperties, useCallback} from "react";
import styles from "../../styles/DiscoverLine.module.css";

export default function DiscoverLine({
  label,
  scrollToID,
  style
}: { label: string, scrollToID: string, style?: CSSProperties }): JSX.Element {
  const scrollIntoView = useCallback(() => {
    document.getElementById(scrollToID)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, [scrollToID]);

  return (
    <button className={styles.container} onClick={scrollIntoView} style={style}>
      <div className={styles.arrowWrapper}>
        <div className={styles.arrow}>{"→"}</div>
      </div>
      <p className={styles.label}>{label}</p>
      <hr className={styles.line}/>
    </button>
  );
}