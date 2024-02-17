import {isElement} from "./utils";
import {Element} from "./Element";
import {Movable} from "./Movable";
import {Sand} from "./Sand";
import {Water} from "./Water";
import {Wall} from "./Wall";

const GRID_WIDTH = 300;
const GRID_HEIGHT = 150;


const MATERIAL_MAPPING: Map<string, { new(): Element }> = new Map()
MATERIAL_MAPPING.set("w", Water);
MATERIAL_MAPPING.set("s", Sand);
MATERIAL_MAPPING.set("t", Wall);

export class Grid {
  height = GRID_HEIGHT;
  width = GRID_WIDTH;
  cells: (Element | unknown)[][];
  dirtyRows: (unknown | true)[];

  constructor() {
    this.cells = Array.from({length: this.height}).map(() => {
      return Array.from({length: this.width});
    });
    this.dirtyRows = Array.from({length: this.height});
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

  set(cell: Element | unknown, x: number, y: number, dirty = true, force = false): boolean {
    if (y < 0 || y >= this.cells.length) {
      return false;
    }
    if (x < 0 || x >= this.cells[y].length) {
      return false;
    }
    if (this.get(x, y) && !force) {
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
        set: (cell: Element | unknown, x: number, y: number, force?: boolean) => boolean
    } {
    return {
      get: (dx: number, dy: number) => {
        return this.get(x + dx, y + dy);
      },
      set: (cell: Element | unknown, dx: number, dy: number, force = false) => {
        const dirty = Boolean(dy || dx) || force;
        if (this.set(cell, x + dx, y + dy, dirty, force)) {
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
      cell.draw(ctx, this, x, y);
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

  spawn(x: number, y: number, radius: number, generator: () => (Element | unknown), force: boolean) {
    const {set} = this.centerAt(x, y);
    for (let y = -radius; y < radius; y++) {
      for (let x = -radius; x < radius; x++) {
        const range = Math.sqrt(x * x + y * y);
        if (range <= radius) {
          const cell = generator();
          // force only if the cell is unknown, since it means we're erasing
          set(cell, x, y, force);
        }
      }
    }
  }

  encode(): string {
    let encoded = "";
    this.cells.forEach(row => {
      row.forEach(cell => {
        if (cell instanceof Sand) {
          encoded += "s";
        } else if (cell instanceof Water) {
          encoded += "w";
        } else if (cell instanceof Wall) {
          encoded += "t";
        } else {
          encoded += "_";
        }
      });
    });
    return encoded;
  }

  decode(encoded: string, width: number, height: number) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const letter = encoded[index];
        const cell = MATERIAL_MAPPING.get(letter);
        this.set(cell ? new cell() : undefined, x, y, true, true)
      }
    }
  }

  dirtyAll() {
    this.dirtyRows.forEach((_, i) => this.dirtyRows[i] = true);
  }
}