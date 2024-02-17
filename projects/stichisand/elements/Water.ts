import {Movable} from "./Movable";
import {getRandomItem, pathUntil} from "./utils";
import {Grid} from "./Grid";
import {Element} from "./Element";

const COLORS = ["#0077b6", "#00b4d8"]
const FRICTION_FACTOR = 0.6;

export class Water extends Movable {

  constructor() {
    super();
    this.fillStyle = getRandomItem(COLORS);
  }

  update(grid: Grid, nextGrid: Grid, x: number, y: number) {
    super.update(grid, nextGrid, x, y);
    const {get} = grid.centerAt(x, y);
    const {set} = nextGrid.centerAt(x, y);

    if (!this.tryMoveDown(get, set)) {
      if (!this.tryLateralMove(get, set, this.fallDirection)) {
        if (!this.tryLateralMove(get, set, -this.fallDirection)) {
          this.speed *= FRICTION_FACTOR;
          if (!this.trySidewaysMove(get, set, this.fallDirection)) {
            this.trySidewaysMove(get, set, -this.fallDirection)
          }
        }
      }
    }

    if (!this.hasMoved) {
      return set(this, 0, 0);
    }
    return this.hasMoved;
  }

  tryLateralMove(get: (x: number, y: number) => Element | unknown, set: (cell: Water, x: number, y: number) => boolean, direction: number): boolean {
    const hypotenuse = Math.max(Math.round(this.speed), 1);
    const lateral = direction * hypotenuse;

    const {x, y} = pathUntil(lateral, hypotenuse, get);
    if (x || y) {
      this.hasMoved = set(this, x, y);
      if (this.hasMoved) {
        this.fallDirection = direction;
      }
      return this.hasMoved;
    }
    return false;
  }

  trySidewaysMove(get: (x: number, y: number) => Element | unknown, set: (cell: Water, x: number, y: number) => boolean, direction: number): boolean {
    const lateral = direction * Math.max(Math.round(this.speed), 1);
    const {x, y} = pathUntil(lateral, 0, get);
    if (x || y) {
      this.hasMoved = set(this, x, y);
      if (this.hasMoved) {
        this.fallDirection = direction;
      }
      return this.hasMoved;
    }
    return false;
  }
}