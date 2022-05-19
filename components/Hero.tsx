import Planetary from "./Planetary";
import styles from "../styles/Hero.module.css";
import {useTranslation} from "next-export-i18n";
import Logo from "../public/stichiboi-logo.svg";
import DiscoverLine from "./generic/DiscoverLine";

export default function Hero(): JSX.Element {
    const {t} = useTranslation();

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.titleContainer}>
                        <div className={styles.logo}><Logo/></div>
                        <h1 className={styles.title}>{t('hero.title')}</h1>
                    </div>
                    <hr className={`${styles.accentLine}`}/>
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
            <DiscoverLine label={t("hero.discover")}
                          scrollToID={"intro"}
                          style={{
                              paddingLeft: "4em"
                          }}/>
        </div>
    );
}