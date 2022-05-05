import {CSSProperties, useMemo} from "react";
import styles from "../styles/LoadingScreen.module.css";
import {useTranslation} from "next-export-i18n";

export default function LoadingScreen({isLoading}: { isLoading: boolean }): JSX.Element {
    const DOT_COUNT = 7;

    const {t} = useTranslation();
    const dots = useMemo(() => {
        return Array.from({length: DOT_COUNT}).map((_, i) => (
            <div key={i}
                 className={`${styles.dotContainer} ${isLoading ? '' : styles.toggled}`}
                 style={{
                     "--delay": `calc(var(--duration) * ${i / DOT_COUNT});`
                 } as unknown as CSSProperties}>
                <div className={styles.dot}/>
            </div>
        ))
    }, [DOT_COUNT, isLoading]);
    return (
        <div className={`${styles.container} ${isLoading ? '' : styles.toggled}`}>
            <p className={`${styles.text} ${isLoading ? '' : styles.toggled}`}>{t("loading.first")}</p>
            <p className={`${styles.text} ${isLoading ? styles.toggled : ''}`}>{t("loading.loaded")}</p>
            <div className={styles.dotsContainer}>
                {dots}
            </div>
        </div>
    )
}