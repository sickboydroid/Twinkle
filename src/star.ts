import { stars, walls, WORLD_HEIGHT, WORLD_WIDTH } from "./main";
import { G, randomBrightColor } from "./utils";

export class Star {
  readonly MAX_VX = 10000;
  readonly MAX_VY = 10000;
  x: number;
  y: number;
  color = randomBrightColor();
  vx = 0;
  vy = 0;
  mass = 1000;
  markedForDeletion = false;
  radius = 5;
  isFixed = false;
  ax = 0;
  ay = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  computeAcceleration() {
    [this.ax, this.ay] = [0, 0];
    for (const star of stars) {
      if (star == this) continue;
      const [gx, gy] = star.getGravitationalFieldAt(this.x, this.y);
      this.ax += gx;
      this.ay += gy;
    }
  }

  update(deltaTime: number) {
    if (this.isFixed) return;

    // update velocity
    this.vx += this.ax * deltaTime;
    this.vy += this.ay * deltaTime;
    this.vx = Math.max(-this.MAX_VX, Math.min(this.MAX_VX, this.vx));
    this.vy = Math.max(-this.MAX_VY, Math.min(this.MAX_VY, this.vy));

    // check collisions with wall
    for (const wall of walls) {
      if (wall.wallType === "left") {
        const bound = wall.x + wall.width;
        if (this.x - this.radius < bound) {
          this.x = bound + this.radius;
          this.vx = Math.abs(this.vx);
        }
      } else if (wall.wallType === "right") {
        const bound = wall.x;
        if (this.x + this.radius > bound) {
          this.x = bound - this.radius;
          this.vx = -Math.abs(this.vx);
        }
      } else if (wall.wallType === "top") {
        const bound = wall.y + wall.height;
        if (this.y - this.radius < bound) {
          this.y = bound + this.radius;
          this.vy = Math.abs(this.vy);
        }
      } else if (wall.wallType === "bottom") {
        const bound = wall.y;
        if (this.y + this.radius > bound) {
          this.y = bound - this.radius;
          this.vy = -Math.abs(this.vy);
        }
      }
    }

    // update position
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // check if left the world
    this.markedForDeletion =
      this.x < -10 * WORLD_WIDTH ||
      this.x > 10 * WORLD_WIDTH ||
      this.y < -10 * WORLD_HEIGHT ||
      this.y > 10 * WORLD_HEIGHT;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  getGravitationalFieldAt(x: number, y: number) {
    const eps = 25; //  preventing inf values, and for softening
    const dx = this.x - x;
    const dy = this.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy + eps * eps);
    let g = (G * this.mass) / (dist * dist);
    return [(g * dx) / dist, (g * dy) / dist];
  }
}
