import {
  COEFFICIENT_OF_RESTITUTION,
  stars,
  walls,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "./main";
import { G, randomBrightColor } from "./utils";
import Vector from "./vector";

export class Star {
  readonly MAX_VX = 5000;
  readonly MAX_VY = 5000;
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
    const e = COEFFICIENT_OF_RESTITUTION;
    for (const wall of walls) {
      if (wall.wallType === "left") {
        const bound = wall.x + wall.width;
        if (this.x - this.radius < bound) {
          this.x = bound + this.radius;
          this.vx = Math.abs(this.vx) * e;
        }
      } else if (wall.wallType === "right") {
        const bound = wall.x;
        if (this.x + this.radius > bound) {
          this.x = bound - this.radius;
          this.vx = -Math.abs(this.vx) * e;
        }
      } else if (wall.wallType === "top") {
        const bound = wall.y + wall.height;
        if (this.y - this.radius < bound) {
          this.y = bound + this.radius;
          this.vy = Math.abs(this.vy) * e;
        }
      } else if (wall.wallType === "bottom") {
        const bound = wall.y;
        if (this.y + this.radius > bound) {
          this.y = bound - this.radius;
          this.vy = -Math.abs(this.vy) * e;
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

export function resolveStarCollisons() {
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const s1 = stars[i];
      const s2 = stars[j];
      let pos1 = new Vector(s1.x, s1.y);
      let pos2 = new Vector(s2.x, s2.y);
      const dist = pos2.subtract(pos1).magnitude();
      if (dist >= s1.radius + s2.radius)
        // stars are not colliding
        continue;
      const normal = pos2.subtract(pos1).unit();
      // separate stars
      const penetration = s1.radius + s2.radius - dist;
      pos1 = pos1.add(normal.scale(-penetration / 2));
      pos2 = pos2.add(normal.scale(penetration / 2));
      [s1.x, s1.y] = [pos1.x, pos1.y];
      [s2.x, s2.y] = [pos2.x, pos2.y];
      const vS1 = new Vector(s1.vx, s1.vy);
      const vS2 = new Vector(s2.vx, s2.vy);
      if (vS2.subtract(vS1).dot(normal) < 0)
        // stars are already moving away
        continue;
      const m1 = s1.mass;
      const m2 = s2.mass;
      const e = COEFFICIENT_OF_RESTITUTION;
      // u1 u2 are initial and v1 v2 are final velocities along normal
      const u1 = vS1.dot(normal);
      const u2 = vS2.dot(normal);
      const v1 = (u1 * (m1 - m2 * e) + m2 * u2 * (1 + e)) / (m1 + m2);
      const v2 = (u2 * (m2 - m1 * e) + m1 * u1 * (1 + e)) / (m1 + m2);
      const { perp: perp1 } = vS1.resolve(normal);
      const { perp: perp2 } = vS2.resolve(normal);
      const newParalle1 = normal.scale(v1);
      const newParalle2 = normal.scale(v2);
      const newVS1 = newParalle1.add(perp1);
      const newVS2 = newParalle2.add(perp2);
      [s1.vx, s1.vy] = [newVS1.x, newVS1.y];
      [s2.vx, s2.vy] = [newVS2.x, newVS2.y];
    }
  }
}
