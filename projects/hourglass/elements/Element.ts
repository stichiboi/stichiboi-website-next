import {Grid, GRID_HEIGHT, GRID_WIDTH} from "./Grid";

export class Element {
    fillStyle: string = "";

    draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
        const {width, height} = ctx.canvas;
        ctx.beginPath();
        const posX = x * width / GRID_WIDTH;
        const posY = y * height / GRID_HEIGHT;
        const wx = Math.max(1, width / GRID_WIDTH);
        const wy = Math.max(1, height / GRID_HEIGHT);
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