import { useCallback, useEffect, useRef } from "react";
import { CanvasAnimation } from "@stichiboi/react-elegant-mouse-trail/lib/CanvasAnimation";
import styles from "../styles/Chart.module.css"

interface ChartProps {
  data: number[],
  plot: () => unknown
}

export function Chart({ data, plot }: ChartProps): JSX.Element {

  const dataRef = useRef<number[]>([]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    const marginY = Math.min(height * 0.2, 0);
    const marginX = Math.min(height * 0.04, 200);
    ctx.clearRect(
      0, 0,
      width,
      height
    );

    ctx.beginPath();
    ctx.lineWidth = 2;
    const gradient = ctx.createLinearGradient(marginX, 0, width - marginX, 0);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(0.05, "rgba(0, 0, 0, .5)");
    gradient.addColorStop(0.95, "rgba(0, 0, 0, .5)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.strokeStyle = gradient;


    function actualY(y: number) {
      return (1 - y) * (height - marginY) + marginY / 2;
    }

    function actualX(x: number) {
      return (x / dataRef.current.length) * (width - marginX) + marginX / 2;
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
      move={plot}
      draw={draw}
    />
  );
}