import React from "react";
import styles from "../styles/Projects.module.css";
import { useTranslation } from "next-export-i18n";
import { ProjectCard } from "./ProjectCard";

export default function Projects(): JSX.Element {
  const { t } = useTranslation();

  return (
    <main id={"projects"} className={styles.container}>
      <ProjectCard
        title={t("projects.sudoku.title")}
        description={t("projects.sudoku.description")}
        imageSrc={"/sudoku-hero.png"}
        imageAlt={t("projects.sudoku.alt")}
      />
      <div>
        Reflexo
      </div>
      <div>
        Clock
      </div>
    </main>
  );
}