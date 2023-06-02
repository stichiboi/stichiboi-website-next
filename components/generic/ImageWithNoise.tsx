import Image from "next/image";
import styles from "../../styles/ImageWithNoise.module.css";
import React from "react";

interface ImageWithNoiseProps {
  cardId: string,
  imageSrc: string,
  imageAlt: string,
}

export function ImageWithNoise({ cardId, imageAlt, imageSrc }: ImageWithNoiseProps): JSX.Element {
  const pulseDurationMs = 600;
  const filterId = `noise_${cardId}`;

  return (
    <>
      <svg style={{ width: 0, height: 0 }}>
        <defs>
          <filter id={filterId}>
            <feTurbulence baseFrequency={"0.8,0.8"} seed={0} type={"fractalNoise"}>
              <animate
                attributeName="seed"
                values="0;100"
                dur={`${pulseDurationMs}ms`}
                repeatCount="1"
                begin={`${cardId}.mouseenter`}
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="static"
              scale="0"
            >
              <animate
                attributeName="scale"
                values="0;5;0"
                dur={`${pulseDurationMs}ms`}
                repeatCount="1"
                begin={`${cardId}.mouseenter`}
              />
            </feDisplacementMap>
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
    </>
  );
}