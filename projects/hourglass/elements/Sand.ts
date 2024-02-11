import {Element} from "./Element";
import {getRandomItem, pathUntil} from "./utils";
import {Grid, GRID_HEIGHT, GRID_WIDTH} from "./Grid";

const COLORS = ["b0b2ad", "f4eade", "dcbcad", "dd967a", "d49955"];
const INITIAL_SPEED = 0.1;
const TERMINAL_VELOCITY = 5;
const ACCELERATION = 1.2;
const FRICTION_FACTOR = 0.8;
const INERTIAL_RESISTANCE = 0.1;

export class Sand extends Element {
    speed: number = INITIAL_SPEED;
    fallDirection: number = getRandomItem([-1, 1]);
    hasMoved: boolean = false;

    constructor() {
        super();
        this.fillStyle = `#${getRandomItem(COLORS)}`
    }

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
        super.update(grid, nextGrid, x, y);
        this.hasMoved = false;
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
            this.speed = INITIAL_SPEED;
            return set(this, 0, 0);
        } else {
            this.speed *= ACCELERATION;
            this.speed = Math.min(TERMINAL_VELOCITY, this.speed);
        }
        return this.hasMoved;
    }

    tryMoveDown(get: (x: number, y: number) => unknown, set: (cell: Sand, x: number, y: number) => boolean): boolean {
        const down = Math.max(Math.round(this.speed), 1)
        const {x, y} = pathUntil(0, down, get);
        if (x || y) {
            this.hasMoved = set(this, x, y);
            return this.hasMoved;
        }
        return false;
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
}