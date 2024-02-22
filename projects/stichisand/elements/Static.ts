import {Element} from "./Element"
import {Grid} from "./Grid";


export class Static extends Element {
  isFirstRender = true;

  constructor() {
    super();
  }

  draw(ctx: CanvasRenderingContext2D, grid: Grid, x: number, y: number) {
    super.draw(ctx, grid, x, y);
    this.isFirstRender = false;
  }

  update(grid: Grid, nextGrid: Grid, x: number, y: number) {
    super.update(grid, nextGrid, x, y);
    nextGrid.set(this, x, y, this.isFirstRender);
  }
}