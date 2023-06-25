import styles from "../../styles/Title.module.css";
import { CSSProperties, ReactNode, useMemo } from "react";

interface TitleProps {
  text: string,
  icon?: ReactNode,
  className?: string
}

export function Title({ icon, text, className }: TitleProps) {

  const letters = useMemo(() => {
    return Array.from(text).map((char, index) => {
      return <p
        key={`${char}-${index}`}
        className={styles.letter}
        style={{
          "--index": index
        } as CSSProperties}>{char}</p>
    });
  }, [text]);

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.title}>
        <h1 className={styles.letters}>
          {letters}
        </h1>
        <h1 className={styles.letters}>
          {letters}
        </h1>
      </div>
    </div>
  )
}