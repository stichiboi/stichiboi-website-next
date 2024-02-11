import {Grid} from "./Grid";

export class Element {
    fillStyle: string = "";

    draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
        return;
    }

    update(grid: Grid, nextGrid: Grid, x: number, y: number) {
        return;
    }
}