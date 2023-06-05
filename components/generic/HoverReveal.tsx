import React, { CSSProperties, ReactNode } from "react";
import styles from "../../styles/HoverReveal.module.css";

interface HoverRevealProps {
  children: ReactNode,
  colors: string[]
}

export default function HoverReveal({ children, colors }: HoverRevealProps): JSX.Element {

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {children}
      </div>
      {colors.map((c, i) => (
        <div key={c}
          className={styles.content}
          style={{
            "--background": c,
            "--delay": `${.2 * i}s`
          } as unknown as CSSProperties}
        />
      ))}
    </div>
  );
}