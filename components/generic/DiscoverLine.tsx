import React, {useCallback} from "react";
import styles from "../../styles/DiscoverLine.module.css";

export default function DiscoverLine({label, scrollToID}: { label: string, scrollToID: string }): JSX.Element {
    const scrollIntoView = useCallback(() => {
        document.getElementById(scrollToID)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, [scrollToID]);

    return (
        <button className={styles.discoverMore} onClick={scrollIntoView}>
            <div className={styles.discoverArrowWrapper}>
                <div className={styles.discoverArrow}>{"→"}</div>
            </div>
            <p>{label}</p>
            <hr className={styles.discoverLine}/>
        </button>
    );
}