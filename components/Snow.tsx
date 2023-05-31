import React, { useCallback, useMemo, useRef } from "react";
import CanvasAnimation from "./generic/CanvasAnimation";
import styles from "../styles/Snow.module.css";

interface Point {
    x: number,
    y: number,
    age: number,
    color: number[],
    rotation: number,
    fallSpeed: number
}

interface SnowProps {
    className?: string;
    maxAge?: number;
    drawProbability?: number;
}

export default function Snow({ className, maxAge, drawProbability }: SnowProps): JSX.Element {
  const points = useRef<Point[]>([]);
  const COLORS = useMemo(() => ([[185, 247, 251], [218, 233, 255]]), []);
  const MAX_AGE = useMemo(() => maxAge || 2000, [maxAge]);
  const DRAW_PROBABILITY = useMemo(() => drawProbability || 0.1, [drawProbability]);

  const drawFlake = useCallback((ctx: CanvasRenderingContext2D, flake: Point) => {
    const size = Math.log(flake.age);
    ctx.beginPath();
    // ctx.translate(flake.x + size / 2, flake.y + size / 2);
    // ctx.rotate(flake.rotation / 180);
    // ctx.translate(-(flake.x + size / 2), -(flake.y + size / 2));

    ctx.rect(flake.x, flake.y, size, size);
    ctx.fillStyle = `rgba(${[...flake.color, (MAX_AGE - flake.age) / MAX_AGE].join(', ')})`;
    ctx.fill();
  }, [MAX_AGE]);

  const animatePoints = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(
      0, 0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    points.current.forEach((p, i) => {
      p.age++;
      if (p.age > MAX_AGE) {
        points.current.splice(i, 1);
      } else {
        p.rotation++;
        p.y += p.fallSpeed;
        drawFlake(ctx, p);
      }
      return p;
    });
  }, [MAX_AGE, points, drawFlake]);

  const draw = useCallback((canvas: HTMLCanvasElement) => {
    if (Math.random() < DRAW_PROBABILITY) {

      const canvasSize = canvas.getBoundingClientRect();
      const x = Math.random() * canvasSize.width;
      const y = Math.random() * canvasSize.height / 2;
      const fallSpeed = Math.random() + .1;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      points.current.push({ x, y, color, fallSpeed, age: 0, rotation: 0 });
    }
  }, [DRAW_PROBABILITY, COLORS]);
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.background}/>
      <CanvasAnimation className={styles.snow} draw={draw} animatePoints={animatePoints}/>
    </div>
  );
}