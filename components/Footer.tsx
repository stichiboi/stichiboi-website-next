import styles from "../styles/Footer.module.css";
import { useTranslation } from "next-export-i18n";
import React from "react";
import Image from "next/image";
import Logo from "../public/stichiboi-logo.svg";

export function Footer(): JSX.Element {
  const { t } = useTranslation();
  return (
    <footer id={"footer"} className={styles.footer}>
      <div className={styles.background}>
        <Image src={"/background-pattern.png"} alt={"null"} width={1280} height={1280}/>
      </div>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.logo}><Logo/></div>
          <p className={styles.text}>{t("footer.text")}</p>
        </div>
        <p className={styles.copyright}>{t("footer.copyright")}</p>
        <button
          title={t("footer.backToTop")}
          className={styles.backToTop}
          onClick={() => {
            document.getElementById("hero")?.scrollIntoView({
              behavior: "smooth", block: "start"
            })
          }}>
          <p className={styles.backToTopLabel}>{"↑"}</p>
        </button>
      </div>
    </footer>
  );
}