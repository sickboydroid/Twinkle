import { currentStarData, initControls, updateStarCount } from "./controls";
import { randomBrightColor } from "./utils";
import Wall from "./wall";

export const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
export const WORLD_WIDTH = window.innerWidth;
export const WORLD_HEIGHT = window.innerHeight;
const G = 100;
export let stars: Star[] = [];
export let walls: Wall[] = [];
let lastTime = 0;

initCanvas();
toggleWalls();
initControls();
/**********************UTIL METHODS****************/
function initCanvas() {
  canvas.addEventListener("click", (event) => addNewStar(event.x, event.y));
  canvas.addEventListener("mousemove", (event) => {
    if (event.altKey) addNewStar(event.x, event.y);
  });
  canvas.width = WORLD_WIDTH;
  canvas.height = WORLD_HEIGHT;
  requestAnimationFrame(draw);
}

export function toggleWalls() {
  if (!currentStarData.walls) {
    walls.length = 0;
    return;
  }
  walls.push(
    new Wall("left"),
    new Wall("right"),
    new Wall("top"),
    new Wall("bottom"),
  );
}

function addNewStar(x: number, y: number) {
  console.log("adding new star");
  const star = new Star(x, y);
  star.mass = currentStarData.mass;
  star.radius = currentStarData.radius;
  star.isFixed = currentStarData.fixed;
  star.vx = currentStarData.vx;
  star.vy = currentStarData.vy;
  stars.push(star);
}

/******************Drawing Logic**********************/

function draw(curTime: number) {
  ctx.fillStyle = "rgba(40,40,40,0.08)";
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  if (lastTime == 0) lastTime = curTime;
  const deltaTime = Math.min(curTime - lastTime, 20) / 1000;
  lastTime = curTime;
  for (const star of stars) {
    star.computeAcceleration();
  }
  for (const star of stars) {
    star.update(deltaTime);
    star.draw(ctx);
  }
  for (const wall of walls) {
    wall.draw(ctx);
  }
  ctx.font = "20px monospace";
  ctx.fillStyle = "white";
  stars = stars.filter((star) => !star.markedForDeletion);
  updateStarCount(stars.length);
  requestAnimationFrame(draw);
}

/***************************ENTITIES**********************/
class Star {
  readonly MAX_VX = 500;
  readonly MAX_VY = 500;
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
    this.vx += Math.min(
      this.MAX_VX,
      Math.max(-this.MAX_VX, this.ax * deltaTime),
    );

    this.vy += Math.min(
      this.MAX_VY,
      Math.max(-this.MAX_VY, this.ay * deltaTime),
    );

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
