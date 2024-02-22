import {getRandomItem} from "./utils";
import {Static} from "./Static";

const COLORS = ["#495057", "#6c757d", "#343a40"]

export class Wall extends Static {
  isFirstRender = true;

  constructor() {
    super();
    this.fillStyle = getRandomItem(COLORS);
  }
}