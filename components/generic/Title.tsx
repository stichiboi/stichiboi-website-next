import styles from "../../styles/Title.module.css";
import { CSSProperties, ReactNode, useMemo } from "react";

interface TitleProps {
  text: string,
  icon?: ReactNode,
  className?: string,
  isH1?: boolean
}

export function Title({ icon, text, className, isH1 }: TitleProps) {

  const letters = useMemo(() => {
    const elements = Array.from(text).map((char, index) => {
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
  }, [text, isH1]);

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.title}>
        {letters}
        {/* the second copy is required for hover effect */}
        {letters}
      </div>
    </div>
  )
}