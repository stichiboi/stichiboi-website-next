import styles from "../styles/MouseTrail.module.css";
import {MutableRefObject, useCallback, useEffect, useRef} from "react";

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

    const canvas = useRef<HTMLCanvasElement>() as MutableRefObject<HTMLCanvasElement>;
    const context = useRef<CanvasRenderingContext2D>();
    const mouseLocation = useRef<Coords>({x: 0, y: 0});
    const points = useRef<Point[]>([]);

    const resizeCanvas = useCallback(() => {
        if (context.current?.canvas) {
            context.current.canvas.width = window.innerWidth;
            context.current.canvas.height = window.innerHeight
        }
    }, [context]);

    const makePath = useCallback((start: Point, end: Point, color: string, lineWeight: number) => {
        const ctx = context.current;
        if (!ctx) return;

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
    }, [context]);

    const animatePoints = useCallback(() => {
        const ctx = context.current;
        if (!ctx) return;
        ctx.clearRect(
            0, 0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        const maxAge = LINE_DURATION * 1000 / 60;
        points.current.forEach((point, i, arr) => {
            const prevPoint = i ? arr[i - 1] : arr[i];
            point.age += 1;
            if (point.age > maxAge) {
                points.current.splice(i, 1);
            } else {
                const lineWeight = LINE_WIDTH_START / (point.age * 2)
                makePath(point, prevPoint, STROKE_COLOR, lineWeight);
            }
        });
    }, [points, makePath, STROKE_COLOR]);

    const draw = useCallback(() => {
        const mouse = mouseLocation.current;
        const lastPoint: Point = points.current[points.current.length - 1] || mouse;
        const x = mouse.x - (mouse.x - lastPoint.x) * LAG;
        const y = mouse.y - (mouse.y - lastPoint.y) * LAG;
        points.current.push({x, y, age: 0});

        animatePoints();
        window.requestAnimationFrame(draw);
    }, [mouseLocation, animatePoints]);

    useEffect(() => {
        function init() {
            const tempContext = canvas.current.getContext('2d');
            if (!tempContext) throw Error("Cannot create canvas context");
            tempContext.lineJoin = "round";
            context.current = tempContext;

            window.addEventListener('resize', () => {
                resizeCanvas();
            });

            document.body.addEventListener('mousemove', e => {
                mouseLocation.current = {
                    x: e.clientX,
                    y: e.clientY
                };
            });
            draw();
            resizeCanvas();
        }

        document.addEventListener('readystatechange', init);
        return () => document.removeEventListener('readystatechange', init)
    }, [draw, resizeCanvas]);

    return (
        <canvas ref={canvas} className={styles.mouseTrail}/>
    )
}