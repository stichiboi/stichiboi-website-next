import styles from "../styles/MouseTrail.module.css";
import {useCallback, useEffect, useRef} from "react";
import CanvasAnimation from "./generic/CanvasAnimation";

interface Coords {
    x: number,
    y: number,
}

interface Point extends Coords {
    age: number
}

export default function MouseTrail(): JSX.Element {
    const LINE_DURATION = 1;
    const LINE_WIDTH_START = 8;
    const STROKE_COLOR = `rgb(${[255, 0, 0].join(', ')})`;
    const LAG = 0.92;
    const MAX_AGE = LINE_DURATION * 1000 / 60;

    const mouseLocation = useRef<Coords>({x: 0, y: 0});
    const points = useRef<Point[]>([]);

    const updateMouse = useCallback((event: MouseEvent) => {
        mouseLocation.current = {
            x: event.clientX,
            y: event.clientY
        };
    }, [mouseLocation]);

    const makePath = useCallback((ctx: CanvasRenderingContext2D, start: Point, end: Point, color: string, lineWeight: number) => {
        ctx.lineWidth = lineWeight
        ctx.strokeStyle = color
        ctx.beginPath();

        ctx.moveTo(end.x, end.y);
        ctx.arcTo(start.x, start.y, end.x, end.y, 50);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(end.x, end.y, lineWeight / 2, 0, Math.PI * 2);
        ctx.fill();
    }, []);

    const animatePoints = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(
            0, 0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        points.current.forEach((point, i, arr) => {
            const prevPoint = i ? arr[i - 1] : arr[i];
            point.age += 1;
            if (point.age > MAX_AGE) {
                points.current.splice(i, 1);
            } else {
                const lineWeight = LINE_WIDTH_START / (point.age * 2)
                makePath(ctx, point, prevPoint, STROKE_COLOR, lineWeight);
            }
        });
    }, [points, makePath, MAX_AGE, LINE_WIDTH_START, STROKE_COLOR]);

    const draw = useCallback(() => {
        const mouse = mouseLocation.current;
        const lastPoint: Point = points.current[points.current.length - 1] || mouse;
        const x = mouse.x - (mouse.x - lastPoint.x) * LAG;
        const y = mouse.y - (mouse.y - lastPoint.y) * LAG;
        points.current.push({x, y, age: 0});
    }, [mouseLocation, points]);

    useEffect(() => {
        document.body.addEventListener('mousemove', updateMouse);

        return () => {
            window.removeEventListener('mousemove', updateMouse);
        }
    }, [updateMouse]);

    return (
        <CanvasAnimation
            className={styles.mouseTrail}
            draw={draw}
            animatePoints={animatePoints}/>
    )
}