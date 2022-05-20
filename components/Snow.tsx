import React, {useCallback, useMemo, useRef} from "react";
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

export default function Snow(): JSX.Element {
    const points = useRef<Point[]>([]);
    const COLORS = useMemo(() => ([[185, 247, 251], [218, 233, 255]]), []);
    const MAX_AGE = 2000;
    const DRAW_PROBABILITY = .1;

    const drawFlake = useCallback((ctx: CanvasRenderingContext2D, flake: Point) => {
        const size = Math.log(flake.age);
        ctx.beginPath();
        // ctx.translate(flake.x + size / 2, flake.y + size / 2);
        // ctx.rotate(flake.rotation / 180);
        // ctx.translate(-(flake.x + size / 2), -(flake.y + size / 2));

        ctx.rect(flake.x, flake.y, size, size);
        ctx.fillStyle = `rgba(${[...flake.color, (MAX_AGE - flake.age) / MAX_AGE].join(', ')})`;
        ctx.fill();
    }, []);

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
    }, [points, drawFlake]);

    const draw = useCallback((canvas: HTMLCanvasElement) => {
        if (Math.random() < DRAW_PROBABILITY) {

            const canvasSize = canvas.getBoundingClientRect();
            const x = Math.random() * canvasSize.width;
            const y = Math.random() * canvasSize.height / 2;
            const fallSpeed = Math.random() + .1;
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            points.current.push({x, y, color, fallSpeed, age: 0, rotation: 0});
        }
    }, [points, COLORS]);
    return (
        <CanvasAnimation className={styles.container} draw={draw} animatePoints={animatePoints}/>
    );
}