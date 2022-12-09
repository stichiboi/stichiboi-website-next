import React from "react";
import Snow from "./Snow";
import styles from "../styles/Projects.module.css";
import Image from "next/image";
import { useTranslation } from "next-export-i18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroomBall } from "@fortawesome/free-solid-svg-icons";
import { SnowButton } from "./generic/SnowButton";

export default function Projects(): JSX.Element {
    const { t } = useTranslation();

    return (
        <main id={"projects"} className={styles.container}>
            <div className={styles.snow}>
                <Snow/>
            </div>
            <div className={styles.project}>
                <div className={styles.content}>
                    <h3 className={styles.title}>{t("projects.sudoku.title")}</h3>
                    <p className={styles.description}>{t("projects.sudoku.description")}</p>
                    <SnowButton label={t("projects.cta")}
                                icon={<FontAwesomeIcon icon={faBroomBall}/>}
                                onClick={console.log}/>
                </div>
                <button className={styles.image} onClick={console.log}>
                    <Image src={"/sudoku-hero.png"}
                           width={687} height={667}
                           alt={t("projects.sudoku.alt")}/>
                </button>
            </div>
            <div>
                Reflexo
            </div>
            <div>
                Clock
            </div>
        </main>
    );
}