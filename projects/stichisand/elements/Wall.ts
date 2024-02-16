import {Element} from "./Element"
import {getRandomItem} from "./utils";
import {Grid} from "./Grid";

const COLORS = ["#495057", "#6c757d", "#343a40"]

export class Wall extends Element {
    isFirstRender = true;

    constructor() {
        super();
        this.fillStyle = getRandomItem(COLORS);
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