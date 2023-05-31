import styles from "../styles/Footer.module.css";
import { useTranslation } from "next-export-i18n";
import React from "react";

export function Footer(): JSX.Element {
  const { t } = useTranslation();
  return (
    <footer className={styles.container}>
      <div className={styles.main}>
        <p>{t("footer.text_1")}</p>
        <p>{t("footer.text_2")}</p>
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
        <p>{"↑"}</p>
      </button>
    </footer>
  );
}