import React, {useRef} from "react";
import styles from "../styles/Projects.module.css";
import {useTranslation} from "next-export-i18n";
import {ProjectCard} from "./ProjectCard";
import {Stack} from "./Stack";
import {Title} from "./generic/Title";

export default function Projects(): JSX.Element {
    const {t} = useTranslation();
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
                target={"/stichisand"}
                title={t("projects.stichisand.title")}
                imageSrc={"/stichisand-hero.png"}
                imageAlt={t("projects.stichisand.alt")}
            >
                {t("projects.stichisand.description")}
            </ProjectCard>
            <ProjectCard
                index={2}
                target={"/sudoku"}
                title={t("projects.sudoku.title")}
                imageSrc={"/sudoku-hero.png"}
                imageAlt={t("projects.sudoku.alt")}
            >
                {t("projects.sudoku.description")}
            </ProjectCard>
            <ProjectCard
                index={3}
                target={"/parodle"}
                title={t("projects.parodle.title")}
                imageSrc={"/parodle-hero.png"}
                imageAlt={t("projects.parodle.alt")}
            >
                {t("projects.parodle.with_sup")}
                <sup>*</sup>
                {t("projects.parodle.description")}
                <br/>
                <em><sup>*</sup>{t("projects.parodle.disclaimer")}</em>
            </ProjectCard>
            <ProjectCard
                index={4}
                target={"/silenciometer"}
                title={t("projects.silenciometer.title")}
                imageSrc={"/silenciometer-hero.png"}
                imageAlt={t("projects.silenciometer.alt")}
            >
                {t("projects.silenciometer.description")}
            </ProjectCard>
            <ProjectCard
                index={5}
                target={"/reflexo"}
                title={t("projects.reflexo.title")}
                imageSrc={"/reflexo-hero.png"}
                imageAlt={t("projects.reflexo.alt")}
            >
                {t("projects.reflexo.description")}
            </ProjectCard>
        </section>
    );
}