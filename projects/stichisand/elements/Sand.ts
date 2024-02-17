import {Element} from "./Element";
import {getRandomItem, pathUntil} from "./utils";
import {Grid} from "./Grid";
import {Movable} from "./Movable";
import {Water} from "./Water";

const COLORS = ["#e5cfaa", "#dcbcad", "#dd967a", "#d49955"];

const FRICTION_FACTOR = 0.8;
const INERTIAL_RESISTANCE = 0.1;

export class Sand extends Movable {

  constructor() {
    super();
    this.fillStyle = getRandomItem(COLORS)
  }

  update(grid: Grid, nextGrid: Grid, x: number, y: number) {
    super.update(grid, nextGrid, x, y);
    const {get} = grid.centerAt(x, y);
    const {set} = nextGrid.centerAt(x, y);

    if (!this.tryMoveDown(get, set)) {
      this.speed *= FRICTION_FACTOR;
      const lateralProbability = Math.random() * this.speed;
      if (lateralProbability > INERTIAL_RESISTANCE) {
        if (!this.tryLateralMove(get, set, this.fallDirection)) {
          this.tryLateralMove(get, set, -this.fallDirection);
        }
      }
    }

    if (!this.hasMoved) {
      return set(this, 0, 0);
    }
    return this.hasMoved;
  }

  tryLateralMove(get: (x: number, y: number) => Element | unknown, set: (cell: Sand, x: number, y: number) => boolean, direction: number): boolean {
    const hypotenuse = Math.max(Math.round(Math.sqrt(2) * this.speed), 1);
    const lateral = direction * hypotenuse;

    const {x, y} = pathUntil(lateral, hypotenuse, get);
    if (x || y) {
      this.hasMoved = set(this, x, y);
      return this.hasMoved;
    }
    return false;
  }

  interact(grid: Grid, x: number, y: number) {
    super.interact(grid, x, y);
    this.sink(grid, x, y);
  }

  sink(grid: Grid, x: number, y: number) {
    const {get, set} = grid.centerAt(x, y);
    const below = get(0, 1);
    if (below instanceof Water) {
      set(below, 0, 0, true);
      set(this, 0, 1, true);
    }
  }
}