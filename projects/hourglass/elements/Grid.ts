import {isElement} from "./utils";
import {Element} from "./Element";
import {Movable} from "./Movable";

export const GRID_WIDTH = 300;
export const GRID_HEIGHT = 150;

export class Grid {
    cells: (Element | unknown)[][];
    dirtyRows: (unknown | true)[];

    constructor() {
        this.cells = Array.from({length: GRID_HEIGHT}).map(() => {
            return Array.from({length: GRID_WIDTH});
        });
        this.dirtyRows = Array.from({length: GRID_HEIGHT});
    }

    get(x: number, y: number): Element | unknown {
        if (y < 0 || y >= this.cells.length) {
            return new Element();
        }
        if (x < 0 || x >= this.cells[y].length) {
            return new Element();
        }
        return this.cells[y][x];
    }

    set(cell: Element | unknown, x: number, y: number, dirty = true): boolean {
        if (y < 0 || y >= this.cells.length) {
            return false;
        }
        if (x < 0 || x >= this.cells[y].length) {
            return false;
        }
        if (this.cells[y][x]) {
            return false;
        }
        this.cells[y][x] = cell;
        if (dirty) {
            this.dirtyRows[y] = true;
        }
        return true;
    }

    centerAt(x: number, y: number): {
        get: (x: number, y: number) => Element | unknown,
        set: (cell: Element | unknown, x: number, y: number) => boolean
    } {
        return {
            get: (dx: number, dy: number) => {
                return this.get(x + dx, y + dy);
            },
            set: (cell: Element | unknown, dx: number, dy: number) => {
                const dirty = Boolean(dy || dx);
                if (this.set(cell, x + dx, y + dy, dirty)) {
                    // dirty the previous position (which is not always the row above)
                    this.dirtyRows[y] ||= dirty;
                    return true;
                }
                return false;
            }
        }
    }

    update() {
        const nextGrid = new Grid();
        this.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (isElement(cell)) {
                    cell.update(this, nextGrid, x, y);
                    cell.postUpdate();
                }
            });
        });
        return nextGrid;
    }

    interact() {
        this.loop((cell, x, y) => {
            if (cell instanceof Movable) {
                cell.interact(this, x, y);
            }
        }, () => {
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        const {width, height} = ctx.canvas;
        const rowHeight = height / GRID_HEIGHT;
        const roundedRowHeight = Math.round(rowHeight);
        this.loop((cell, x, y) => {
            cell.draw(ctx, x, y);
        }, (_, y, isDirty) => {
            if (isDirty) {
                ctx.clearRect(0, rowHeight * y, width, roundedRowHeight);
            }
        });
    }

    loop(cellCallback: (cell: Element, x: number, y: number) => unknown, rowCallback?: (row: (Element | unknown)[], y: number, isDirty: boolean) => unknown) {
        this.cells.forEach((row, y) => {
            if (rowCallback) {
                rowCallback(row, y, Boolean(this.dirtyRows[y]));
            }
            if (this.dirtyRows[y]) {
                row.forEach((cell, x) => {
                    if (isElement(cell)) {
                        cellCallback(cell, x, y);
                    }
                });
            }
        });
    }

    spawn(x: number, y: number, radius: number, generator: () => Element, spawn_rate: number = 0.2) {
        const {set, get} = this.centerAt(x, y);
        for (let y = -radius; y < radius; y++) {
            for (let x = -radius; x < radius; x++) {
                if (Math.random() < spawn_rate && !get(x, y)) {
                    set(generator(), x, y);
                }
            }
        }
    }
}