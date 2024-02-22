import {Grid} from "./Grid";

export class Element {
  fillStyle: string = "";

    draw(ctx: CanvasRenderingContext2D, grid: Grid, x: number, y: number) {
        const {width, height} = ctx.canvas;
        const posX = x * width / grid.width;
        const posY = y * height / grid.height;
        const wx = Math.max(1, width / grid.width);
        const wy = Math.max(1, height / grid.height);
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(posX, posY, wx, wy);
    }

  update(_: Grid, __: Grid, ___: number, ____: number) {
    return;
  }

  postUpdate() {
    return;
  }

  interact(_: Grid, __: number, ___: number) {
    return;
  }
}