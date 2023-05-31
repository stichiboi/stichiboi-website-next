import styles from "../styles/Projects.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroomBall } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import React from "react";
import { useTranslation } from "next-export-i18n";
import Button from "./generic/Button";

interface ProjectCardProps {
  title: string,
  description: string,
  imageSrc: string,
  imageAlt: string
}

export function ProjectCard({ title, description, imageSrc, imageAlt }: ProjectCardProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={styles.project}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <Button
          label={t("projects.cta")}
          icon={<FontAwesomeIcon icon={faBroomBall}/>}
          onClick={console.log}/>
      </div>
      <button className={styles.image} onClick={console.log}>
        <Image
          src={imageSrc}
          width={687}
          height={667}
          alt={imageAlt}
        />
      </button>
    </div>
  );
}