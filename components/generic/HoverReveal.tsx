import React, {CSSProperties} from "react";
import styles from "../../styles/HoverReveal.module.css";

export default function HoverReveal({children, colors}: { children: React.ReactChild, colors: string[] }): JSX.Element {

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
                >
                    {children}
                </div>
            ))}
        </div>
    );
}