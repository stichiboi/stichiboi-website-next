import {useCallback, useMemo} from "react";
import {CanvasAnimation} from "@stichiboi/react-elegant-mouse-trail/lib/CanvasAnimation";
import styles from "../styles/ChromoBackground.module.css";

interface ChromoBackgroundProps {
  noise: number,
}

const BORDER = 0.2;
const CENTER_FORCE = 0.0009;
const ALPHA = Math.round(0.85 * 255).toString(16);
const RADIUS_MARGIN_LOW = 0.4;
const RADIUS_MARGIN_HIGH = 0.8;

const PALETTES = [
  ["abe188", "f7ef99", "f1bb87", "f78e69"],
  ["7f95d1", "bf8cbd", "ff82a9", "ffc0be"],
  ["a7c6da", "eefcce", "9eb25d", "f1db4b"],
  ["f4f1de", "e07a5f", "81b29a"]
]

class Blob {
  private x: number;
  private y: number;
  private radius: number;
  private dx: number = 0;
  private dy: number = 0;
  private dr: number = 0;
  readonly speed = 0.00002;
  readonly fillStyle: string;

  constructor(color: string) {
    this.x = Math.random();
    this.y = Math.random();
    this.radius = Math.random() * (RADIUS_MARGIN_HIGH - RADIUS_MARGIN_LOW) + RADIUS_MARGIN_LOW;
    this.fillStyle = `#${color}${ALPHA}`;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    const posX = this.x * ctx.canvas.width;
    const posY = this.y * ctx.canvas.height;
    const radius = Math.min(ctx.canvas.width, ctx.canvas.height) * this.radius;
    ctx.arc(posX, posY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
  }

  move() {
    const deltaDirX = this.speed * (Math.random() * 2 - 1);
    const deltaDirY = this.speed * (Math.random() * 2 - 1);
    const deltaDirR = this.speed * (Math.random() * 2 - 1);
    this.dx += deltaDirX;
    this.dy += deltaDirY;
    this.dr += deltaDirR;
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
    if (this.dr < 0 && this.radius < RADIUS_MARGIN_LOW) {
      this.dr += CENTER_FORCE * (RADIUS_MARGIN_LOW - this.radius);
    }
    if (this.dr > 0 && this.radius > RADIUS_MARGIN_HIGH) {
      this.dr += CENTER_FORCE * (RADIUS_MARGIN_HIGH - this.radius);
    }
    this.x += this.dx;
    this.y += this.dy;
    this.radius += this.dr;
  }
}

export function ChromoBackground({noise}: ChromoBackgroundProps) {
  const opacity = useMemo(() => {
    // return 1;
    return 1 / Math.pow(Math.max(1, noise), 2);
  }, [noise]);

  const blobs = useMemo(() => {
    const colors = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    return colors.map(color => new Blob(color));
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