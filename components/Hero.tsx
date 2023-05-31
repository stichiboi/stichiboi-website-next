import Planetary from "./Planetary";
import styles from "../styles/Hero.module.css";
import { useTranslation } from "next-export-i18n";
import Logo from "../public/stichiboi-logo.svg";
import DiscoverLine from "./generic/DiscoverLine";
import { CSSProperties } from "react";

export default function Hero(): JSX.Element {
  const { t } = useTranslation();
  const NUM_LINES = 6;
  return (
    <div className={styles.container} id={"hero"}>
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
            <div className={styles.descriptionLines}>
              {Array.from({ length: NUM_LINES }).map((_, i) => (
                <hr key={i}
                  className={`${styles.descriptionLine}`}
                  style={{
                    "--scaleY": Math.exp((NUM_LINES - i) / 3) / Math.exp(NUM_LINES / 3),
                    "--delay": `${0.1 * (i - 1)}s`
                  } as unknown as CSSProperties
                  }/>))
              }
            </div>
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