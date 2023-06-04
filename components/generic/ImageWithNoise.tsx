import Image from "next/image";
import styles from "../../styles/ImageWithNoise.module.css";
import React, { useState } from "react";

interface ImageWithNoiseProps {
  cardId: string,
  imageSrc: string,
  imageAlt: string,
}

export function ImageWithNoise({ cardId, imageAlt, imageSrc }: ImageWithNoiseProps): JSX.Element {
  const pulseDurationMs = 600;
  const filterId = `noise_${cardId}`;

  const [animateFill, setAnimateFill] = useState<"freeze" | "remove">("remove");

  return (
    <div
      className={styles.container}
      onMouseLeave={() => setAnimateFill("remove")}
      onMouseEnter={() => setAnimateFill("freeze")}
    >
      <svg style={{ width: 0, height: 0 }}>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in={"SourceGraphic"} stdDeviation={0}>
              <animate
                attributeName={"stdDeviation"}
                fill={animateFill}
                values={"0;2"}
                dur={`${pulseDurationMs}ms`}
                begin={`${cardId}.mouseenter`}
              />
            </feGaussianBlur>
          </filter>
        </defs>
      </svg>
      <Image
        className={styles.image}
        style={{
          filter: `url(#${filterId})`,
          animationDuration: `${pulseDurationMs}ms`
        }}
        src={imageSrc}
        width={687}
        height={667}
        alt={imageAlt}
      />
      <p className={styles.description}>{imageAlt}</p>
    </div>
  );
}