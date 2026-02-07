import { WORLD_HEIGHT, WORLD_WIDTH } from "./main";
import { randomBrightColor } from "./utils";

type WallType = "left" | "right" | "top" | "bottom";

export default class Wall {
  static thickness = 5;
  wallType: WallType;
  x: number;
  y: number;
  width: number;
  height: number;
  color = randomBrightColor();
  constructor(wallType: WallType) {
    this.wallType = wallType;
    if (wallType == "left") {
      this.x = 0;
      this.y = 0;
      this.width = Wall.thickness;
      this.height = WORLD_HEIGHT;
    } else if (wallType == "right") {
      this.x = WORLD_WIDTH - Wall.thickness;
      this.y = 0;
      this.width = Wall.thickness;
      this.height = WORLD_HEIGHT;
    } else if (wallType == "top") {
      this.x = Wall.thickness;
      this.y = 0;
      this.width = WORLD_WIDTH - 2 * Wall.thickness;
      this.height = Wall.thickness;
    } else /*if (wallType == "bottom")*/ {
      this.x = Wall.thickness;
      this.y = WORLD_HEIGHT - Wall.thickness;
      this.width = WORLD_WIDTH - 2 * Wall.thickness;
      this.height = Wall.thickness;
    }
  }
  update() {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
