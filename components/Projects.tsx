import React, { useRef } from "react";
import styles from "../styles/Projects.module.css";
import { useTranslation } from "next-export-i18n";
import { ProjectCard } from "./ProjectCard";
import { Cube } from "./Cube";

export default function Projects(): JSX.Element {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <section id={"projects"} className={styles.container} ref={scrollRef}>
      <div className={`${styles.content} ${styles.about}`}>
        <h3 className={styles.title}>{t("projects.about.title")}</h3>
        <p>{t("projects.about.text")}</p>
      </div>
      <Cube/>
      <ProjectCard
        index={1}
        target={"/sudoku"}
        title={t("projects.sudoku.title")}
        description={t("projects.sudoku.description")}
        imageSrc={"/sudoku-hero.png"}
        imageAlt={t("projects.sudoku.alt")}
      />
      <ProjectCard
        index={2}
        target={"#"}
        title={t("projects.reflexo.title")}
        description={t("projects.reflexo.description")}
        imageSrc={"/reflexo-hero.png"}
        imageAlt={t("projects.reflexo.alt")}
      />
    </section>
  );
}