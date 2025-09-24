import {useCallback, useEffect, useMemo, useRef} from "react";
import styles from "../styles/Flock.module.css";
import {CanvasAnimation} from "@stichiboi/react-elegant-mouse-trail/lib/CanvasAnimation";

const BIRD_COLOR = "rgba(57,69,73,0.83)"
const BIRD_COUNT = 20;

const TURN_SPEED = 0.000005;
const WALL_MARGIN = .1;
const MOUSE_MARGIN = .1;
const BIRD_MARGIN = .1;
const COHERENCE_FACTOR = 0.2;
const ALIGNMENT_FACTOR = 0.07;
const ACCELERATION = 1.0007;
const DECELERATION = 1.3;
const MAX_SPEED = 0.0015;
const MAX_SPEED_ACCELERATION_PERCENTAGE = 0.8;

const THICKNESS = 16;
const TALLNESS = 50;
const DIP = TALLNESS * 0.8;
const VISUAL_RANGE = 0.1;

class Bird {
  x: number;
  y: number;
  dx: number;
  dy: number;
  isScared: boolean = false;


  constructor() {
    this.x = Math.random() / 2 + 0.5;
    this.y = Math.random() / 2 + 0.5;
    this.dx = MAX_SPEED * Math.sign(Math.random() - 0.5);
    this.dy = MAX_SPEED * Math.sign(Math.random() - 0.5);
  }

  update(mouseX: number, mouseY: number, birds: Bird[]) {
    this.x += this.dx;
    this.y += this.dy;
    if (Math.abs(this.dx) > MAX_SPEED && !this.isScared) {
      this.dx /= DECELERATION;
    } else if (Math.abs(this.dx) < MAX_SPEED_ACCELERATION_PERCENTAGE * MAX_SPEED) {
      this.dx *= ACCELERATION;
    }
    if (Math.abs(this.dy) > MAX_SPEED && !this.isScared) {
      this.dy /= DECELERATION;
    } else if (Math.abs(this.dy) < MAX_SPEED_ACCELERATION_PERCENTAGE * MAX_SPEED) {
      this.dy *= ACCELERATION;
    }
    const nearBirds = birds.filter(b => b.distance(this, b) < VISUAL_RANGE);
    nearBirds.forEach(b => {
      this.avoidObstacle(b.x, b.y, BIRD_MARGIN);
      this.cohere(b.x, b.y);
      this.align(b.dx, b.dy);
    });
    this.avoidWall();
    this.isScared = this.avoidObstacle(mouseX, mouseY, MOUSE_MARGIN)

  }

  avoidWall() {
    if (this.x < WALL_MARGIN) {
      this.dx += TURN_SPEED;
    } else if (this.x > 1 - WALL_MARGIN) {
      this.dx -= TURN_SPEED;
    }
    if (this.y < WALL_MARGIN) {
      this.dy += TURN_SPEED;
    } else if (this.y > 1 - WALL_MARGIN) {
      this.dy -= TURN_SPEED;
    }
  }

  avoidObstacle(ox: number, oy: number, margin: number): boolean {
    const dx = this.x - ox;
    const dy = this.y - oy;
    const distance = Math.sqrt(
      Math.pow(dx, 2) + Math.pow(dy, 2)
    );
    const delta = margin - distance;
    if (delta) {
      this.dx += TURN_SPEED * Math.sign(dx) / delta;
      this.dy += TURN_SPEED * Math.sign(dx) / delta;
      return true;
    }
    return false;
  }

  cohere(ox: number, oy: number) {
    const dx = this.x - ox;
    const dy = this.y - oy;
    this.dx -= TURN_SPEED * Math.sign(dx) * COHERENCE_FACTOR;
    this.dy -= TURN_SPEED * Math.sign(dy) * COHERENCE_FACTOR;
  }

  align(odx: number, ody: number) {
    const dx = this.dx - odx;
    const dy = this.dy - ody;
    this.dx -= TURN_SPEED * Math.sign(dx) * ALIGNMENT_FACTOR;
    this.dy -= TURN_SPEED * Math.sign(dy) * ALIGNMENT_FACTOR;
  }

  distance(a: Bird, b: Bird) {
    return Math.sqrt(
      (a.x - b.x) * (a.x - b.x) +
      (a.y - b.y) * (a.y - b.y),
    );
  }

}

export function Flock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const birds = useMemo(() => Array.from({length: BIRD_COUNT}).map(() => {
    return new Bird();
  }), []);

  const mouse = useRef({x: 0, y: 0});

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {

    const {width, height} = ctx.canvas;

    ctx.clearRect(0, 0, width, height);

    ctx.arc(mouse.current.x, mouse.current.y, MOUSE_MARGIN * Math.min(width, height), 0, Math.PI * 2);
    ctx.fillStyle = "#ABC123";
    ctx.fill();
    ctx.closePath();

    birds.forEach(b => {
      b.update(mouse.current.x / width, mouse.current.y / height, birds);
      const angle = Math.atan2(b.dy * height, b.dx * width);
      const x = b.x * width;
      const y = b.y * height
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = BIRD_COLOR;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-TALLNESS, -THICKNESS);
      ctx.lineTo(-DIP, 0);
      ctx.lineTo(-TALLNESS, THICKNESS);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.translate(-x, -y);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    });
  }, [birds]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("pointermove", (ev) => {
        const rect = containerRef.current?.getBoundingClientRect();
        mouse.current = {
          x: ev.x - (rect?.left || 0),
          y: ev.y - (rect?.top || 0)
        }
      });
    }
  }, [containerRef.current]);

  return (
    <div className={styles.container} ref={containerRef}>
      <CanvasAnimation draw={draw}/>
    </div>
  )
}