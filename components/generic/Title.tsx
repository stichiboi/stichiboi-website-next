import styles from "../../styles/Title.module.css";
import {CSSProperties, ReactNode, useCallback, useMemo} from "react";

interface TitleProps {
  text: string,
  hoverText?: string,
  icon?: ReactNode,
  className?: string,
  isH1?: boolean
}

export function Title({icon, text, hoverText, className, isH1}: TitleProps) {
  const buildLetters = useCallback((s: string) => {
    const elements = Array.from(s).map((char, index) => {
      return <p
        key={`${char}-${index}`}
        className={styles.letter}
        style={{
          "--index": index
        } as CSSProperties}>{char}</p>
    });
    if (isH1) {
      return <h1 className={styles.letters}>{elements}</h1>
    }
    return <h3 className={styles.letters}>{elements}</h3>
  }, []);

  const originalLetters = useMemo(() => {
    return buildLetters(text);
  }, [text, buildLetters]);

  const secondaryLetters = useMemo(() => {
    return buildLetters(hoverText || text)
  }, [text, hoverText, buildLetters]);

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.title}>
        {originalLetters}
        {secondaryLetters}
      </div>
    </div>
  )
}