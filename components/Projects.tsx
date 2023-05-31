import React, { useRef } from "react";
import styles from "../styles/Projects.module.css";
import { useTranslation } from "next-export-i18n";
import { ProjectCard } from "./ProjectCard";

export default function Projects(): JSX.Element {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <main id={"projects"} className={styles.container} ref={scrollRef}>
      <ProjectCard
        index={1}
        title={t("projects.sudoku.title")}
        description={t("projects.sudoku.description")}
        imageSrc={"/sudoku-hero.png"}
        imageAlt={t("projects.sudoku.alt")}
      />
      <ProjectCard
        index={2}
        title={t("projects.reflexo.title")}
        description={t("projects.reflexo.description")}
        imageSrc={"/reflexo-hero.png"}
        imageAlt={t("projects.reflexo.alt")}
      />
    </main>
  );
}