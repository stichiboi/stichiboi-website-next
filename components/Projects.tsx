import React, { useRef } from "react";
import styles from "../styles/Projects.module.css";
import { useTranslation } from "next-export-i18n";
import { ProjectCard } from "./ProjectCard";
import { Stack } from "./Stack";
import { Title } from "./generic/Title";

export default function Projects(): JSX.Element {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <section id={"projects"} className={styles.container} ref={scrollRef}>
      <div className={`${styles.content} ${styles.about}`}>
        <Title text={t("projects.about.title")}/>
        <p>{t("projects.about.text")}</p>
      </div>
      <Stack/>
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
        target={"/parodle"}
        title={t("projects.parodle.title")}
        description={t("projects.parodle.description")}
        imageSrc={"/parodle-hero.png"}
        imageAlt={t("projects.parodle.alt")}
      />
      <ProjectCard
        index={3}
        target={"/silenciometer"}
        title={t("projects.silenciometer.title")}
        description={t("projects.silenciometer.description")}
        imageSrc={"/silenciometer-hero.png"}
        imageAlt={t("projects.silenciometer.alt")}
      />
      <ProjectCard
        index={4}
        target={"/reflexo"}
        title={t("projects.reflexo.title")}
        description={t("projects.reflexo.description")}
        imageSrc={"/reflexo-hero.png"}
        imageAlt={t("projects.reflexo.alt")}
      />
    </section>
  );
}