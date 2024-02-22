import {getRandomItem} from "./utils";
import {Static} from "./Static";
import {Grid} from "./Grid";
import {Water} from "./Water";

const COLORS = ["#44bb44", "#2b8f2b", "#156515"];
const GROWTH_RATE = 0.2;
const WATER_CONDUCTION = 0.6;

export class Plant extends Static {
  preferredDirection: number
  isWatered = false;

  constructor() {
    super();
    this.preferredDirection = getRandomItem([1, -1]);
    this.fillStyle = getRandomItem(COLORS);
  }

  interact(grid: Grid, x: number, y: number) {
    super.interact(grid, x, y);
    const {get, set} = grid.centerAt(x, y);
    const directions = this.topFirstDirections().reverse();
    const waterCoords = directions.find(([x, y]) => get(x, y) instanceof Water);
    if (waterCoords) {
      const [waterX, waterY] = waterCoords;
      set(undefined, waterX, waterY, true);
      this.giveWater(grid, x, y);
    }
    if (this.isWatered && Math.random() < GROWTH_RATE) {
      this.grow(grid, x, y);
    }
  }

  giveWater(grid: Grid, x: number, y: number) {
    const {get} = grid.centerAt(x, y);
    if (this.isWatered) {
      const directions = this.topFirstDirections();
      const neighbourPlantCoords = directions.find(([x, y]) => {
        const cell = get(x, y);
        return cell instanceof Plant && !cell.isWatered && Math.random() < WATER_CONDUCTION;
      });
      if (neighbourPlantCoords) {
        const [px, py] = neighbourPlantCoords;
        const plant = get(px, py) as Plant;
        plant.giveWater(grid, x + px, y + py);
      }
    } else {
      this.isWatered = true;
    }
  }

  grow(grid: Grid, x: number, y: number) {
    const {get, set} = grid.centerAt(x, y);
    const directions = this.topFirstDirections();
    directions.find(([gx, gy]) => {
      const cell = get(gx, gy);
      if (!cell) {
        return set(new Plant(), gx, gy);
      }
    });
    this.isWatered = false;
  }

  topFirstDirections() {
    return [
      [0, -1],
      [this.preferredDirection, -1],
      [-this.preferredDirection, -1],
      [this.preferredDirection, 0],
      [-this.preferredDirection, 0],
      [0, 1],
      [this.preferredDirection, 1],
      [-this.preferredDirection, 1],
    ];
  }
}