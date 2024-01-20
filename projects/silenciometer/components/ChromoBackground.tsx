import {useCallback, useMemo} from "react";
import {CanvasAnimation} from "@stichiboi/react-elegant-mouse-trail/lib/CanvasAnimation";
import styles from "../styles/ChromoBackground.module.css";

interface ChromoBackgroundProps {
  noise: number,
}

const BORDER = 0.1;
const CENTER_FORCE = 0.0007;
const ALPHA = Math.round(0.85 * 255).toString(16);

class Blob {
  private x: number;
  private y: number;
  private dx: number = 0;
  private dy: number = 0;
  readonly speed = 0.00004;
  readonly fillStyle: string;

  constructor(color: string, readonly radius: number) {
    this.x = Math.random();
    this.y = Math.random();
    this.fillStyle = `${color}${ALPHA}`
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    const posX = this.x * ctx.canvas.width;
    const posY = this.y * ctx.canvas.height;
    const radius = Math.max(ctx.canvas.width, ctx.canvas.height) * this.radius;
    ctx.arc(posX, posY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
  }

  move() {
    const deltaDirX = this.speed * (Math.random() * 2 - 1);
    const deltaDirY = this.speed * (Math.random() * 2 - 1);
    this.dx += deltaDirX;
    this.dy += deltaDirY;
    if (this.x > 1 + BORDER) {
      this.dx += CENTER_FORCE * (1 - this.x);
    }
    if (this.x < -BORDER) {
      this.dx += CENTER_FORCE * (0 - this.x);
    }
    if (this.y > 1 + BORDER) {
      this.dy += CENTER_FORCE * (1 - this.y);
    }
    if (this.y < -BORDER) {
      this.dy += CENTER_FORCE * (0 - this.y);
    }
    this.x += this.dx;
    this.y += this.dy;
  }
}

export function ChromoBackground({noise}: ChromoBackgroundProps) {
  const opacity = useMemo(() => {
    // return 1;
    return 1 / Math.max(1, noise);
  }, [noise]);

  const blobs = useMemo(() => {
    const colors = ["#dea08c", "#ffecd6", "#a6b5bF"];
    return colors.map(color => new Blob(color, Math.random() + 0.2));
  }, []);

  const move = useCallback(() => {
    blobs.forEach(blob => blob.move());
  }, [blobs]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // ctx.filter = "blur(250px)";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    blobs.forEach(blob => blob.draw(ctx));
  }, [blobs]);

  return (
    <div className={styles.container} style={{"opacity": opacity}}>
      <CanvasAnimation draw={draw} move={move}/>
    </div>
  )
}