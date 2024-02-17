import {getRandomItem, pathUntil} from "./utils";
import {Element} from "./Element";
import {Grid} from "./Grid";

const INITIAL_SPEED = 0.1;
const TERMINAL_VELOCITY = 5;
const ACCELERATION = 1.2;

export class Movable extends Element {
  fallDirection: number = getRandomItem([-1, 1]);
  hasMoved: boolean = false;
  speed: number = INITIAL_SPEED;

  update(grid: Grid, nextGrid: Grid, x: number, y: number) {
    super.update(grid, nextGrid, x, y);
    this.hasMoved = false;
  }

  postUpdate() {
    if (!this.hasMoved) {
      this.speed = INITIAL_SPEED;
    } else {
      this.speed *= ACCELERATION;
      this.speed = Math.min(TERMINAL_VELOCITY, this.speed);
    }
  }

  tryMoveDown(get: (x: number, y: number) => unknown, set: (cell: Movable, x: number, y: number) => boolean): boolean {
    const down = Math.max(Math.round(this.speed), 1)
    const {x, y} = pathUntil(0, down, get);
    if (x || y) {
      this.hasMoved = set(this, x, y);
      return this.hasMoved;
    }
    return false;
  }

  interact(_: Grid, __: number, ___: number) {
    return;
  }
}