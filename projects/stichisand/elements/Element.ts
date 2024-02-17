import {Grid} from "./Grid";

export class Element {
  fillStyle: string = "";

  draw(ctx: CanvasRenderingContext2D, grid: Grid, x: number, y: number) {
    const {width, height} = ctx.canvas;
    ctx.beginPath();
    const posX = x * width / grid.width;
    const posY = y * height / grid.height;
    const wx = Math.max(1, width / grid.width);
    const wy = Math.max(1, height / grid.height);
    ctx.rect(posX, posY, wx, wy)
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
  }

  update(grid: Grid, nextGrid: Grid, x: number, y: number) {
    return;
  }

  postUpdate() {
    return;
  }
}