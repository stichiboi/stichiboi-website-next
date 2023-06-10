import { useCallback, useEffect, useRef } from "react";
import { CanvasAnimation } from "@stichiboi/react-elegant-mouse-trail/lib/CanvasAnimation";
import styles from "../styles/Chart.module.css"

interface ChartProps {
  data: number[],
  draw: () => unknown
}

export function Chart({ data, draw }: ChartProps): JSX.Element {

  const dataRef = useRef<number[]>([]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const animatePoints = useCallback((ctx: CanvasRenderingContext2D) => {
    const marginY = 200;
    const marginX = 200;
    ctx.clearRect(
      0, 0,
      ctx.canvas.width,
      ctx.canvas.height
    );

    ctx.beginPath();
    ctx.lineWidth = 2
    const gradient = ctx.createLinearGradient(marginX, 0, ctx.canvas.width - marginX, 0);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(0.05, "rgba(0, 0, 0, .5)");
    gradient.addColorStop(0.95, "rgba(0, 0, 0, .5)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.strokeStyle = gradient;


    function actualY(y: number) {
      return (1 - y) * (ctx.canvas.height - marginY) + marginY / 2;
    }

    function actualX(x: number) {
      return (x / dataRef.current.length) * (ctx.canvas.width - marginX) + marginX / 2;
    }

    dataRef.current.forEach((y, x) => {
      if (x === 0) {
        ctx.moveTo(actualX(x), actualY(y));
      } else {
        ctx.lineTo(actualX(x), actualY(y));
      }
    });

    ctx.stroke();
  }, []);

  return (
    <CanvasAnimation
      className={styles.chart}
      draw={draw}
      animatePoints={animatePoints}
    />
  );
}