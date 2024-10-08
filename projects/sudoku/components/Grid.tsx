import {ReactChild, useMemo} from 'react';
import styles from "../styles/Grid.module.css";

interface GridProps {
  size: number,
  contents: ReactChild[],
  isSmall?: boolean,
  className?: string
}

export default function Grid({size, contents, isSmall, className}: GridProps) {
  const lineSet = useMemo(() => Array.from({length: size - 1}).map((x, i) => <hr key={i}/>), [size]);

  return (
    <div className={`${styles.container} ${isSmall ? styles.small : ""} ${className || ""}`}>
      <div className={styles.lineSet}>{lineSet}</div>
      <div className={styles.lineSet}>{lineSet}</div>
      <div className={styles.contents}>
        {contents.map((c, i) => <div className={styles.contentWrapper} key={i}>{c}</div>)}
      </div>
    </div>
  )
}