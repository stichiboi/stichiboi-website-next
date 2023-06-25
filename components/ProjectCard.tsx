import styles from "../styles/Projects.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroomBall } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useTranslation } from "next-export-i18n";
import ButtonLink from "./generic/ButtonLink";
import Link from "next/link";
import { ImageWithNoise } from "./generic/ImageWithNoise";
import { Title } from "./generic/Title";


interface ProjectCardProps {
  index: number,
  title: string,
  description: string,
  imageSrc: string,
  imageAlt: string,
  target: string
}

export function ProjectCard({ index, title, description, imageSrc, imageAlt, target }: ProjectCardProps): JSX.Element {
  const { t } = useTranslation();
  const cardId = `image_${title}`;


  return (
    <div className={styles.project}>
      <div className={styles.content}>
        <div className={styles.index}>
          <hr />
          <p>0{index}</p>
        </div>
        <Title text={title} className={styles.title} />
        <p className={styles.description}>{description}</p>
        <ButtonLink
          label={t("projects.cta")}
          icon={<FontAwesomeIcon icon={faBroomBall} />}
          target={target} />
      </div>
      <Link
        id={cardId}
        className={styles.link}
        href={target}
        passHref
      >
        <ImageWithNoise cardId={cardId} imageAlt={imageAlt} imageSrc={imageSrc} />
      </Link>
    </div>
  );
}