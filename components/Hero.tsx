import Planetary from "./Planetary";
import styles from "../styles/Hero.module.css";
import {useTranslation} from "next-export-i18n";
import Logo from "../public/stichiboi-logo.svg";
import {useCallback} from "react";

export default function Hero(): JSX.Element {
    const {t} = useTranslation();
    const scrollIntoView = useCallback(() => {
        document.getElementById('intro')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, []);


    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.titleContainer}>
                        <div className={styles.logo}><Logo/></div>
                        <h1 className={styles.title}>{t('hero.title')}</h1>
                    </div>
                    <hr className={`${styles.discoverLine}`}/>
                    <div className={styles.descriptionContainer}>
                        <div className={`${styles.description}`}>
                            {t('hero.description')}
                            <br/>
                            {t('hero.description2')}
                            <br/>
                            {t('hero.description3')}
                        </div>
                        <hr className={styles.descriptionLine}/>
                    </div>
                </div>
                <Planetary/>
            </main>
            <button className={styles.discoverMore} onClick={scrollIntoView}>
                <div className={styles.discoverArrowWrapper}>
                    <div className={styles.discoverArrow}>{"→"}</div>
                </div>
                <p>{t('hero.discover')}</p>
                <hr className={styles.discoverLine}/>
            </button>
        </div>
    );
}