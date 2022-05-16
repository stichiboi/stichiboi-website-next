import React from "react";
import styles from "../../styles/Link.module.css";

export default function Link({icon, label, onClick, target}: {
                                 icon: JSX.Element,
                                 label: string,
                                 onClick?: () => unknown,
                                 target?: string
                             }
): JSX.Element {
    const content = (
        <div className={styles.content}>
            {icon}
            <p>{label}</p>
        </div>
    )
    return (
        <a className={styles.link} href={target} onClick={onClick}>
            {content}
            {content}
            {content}
        </a>
    );
}