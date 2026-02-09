import {
  currentConfig,
  initControls,
  updateFrameRate,
  updateStarCount,
} from "./controls";
import Feild from "./field";
import { Star } from "./star";
import Wall from "./wall";

export const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
export const WORLD_WIDTH = window.innerWidth;
export const WORLD_HEIGHT = window.innerHeight;
export let stars: Star[] = [];
export let walls: Wall[] = [];
export const field = new Feild();
let lastTime = 0;
const frameRateInfo = {
  lastUpdateTime: 0,
  frameCountSinceUpdate: 0,
};

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
  if (!currentConfig.walls) {
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
  star.mass = currentConfig.mass;
  star.radius = currentConfig.radius;
  star.isFixed = currentConfig.fixed;
  star.vx = currentConfig.vx;
  star.vy = currentConfig.vy;
  stars.push(star);
}

/******************Drawing Logic**********************/

function draw(curTime: number) {
  if (currentConfig.trail) ctx.fillStyle = "rgba(40,40,40,0.08)";
  else ctx.fillStyle = "rgba(40,40,40,1)";
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  if (lastTime == 0) lastTime = curTime;
  if (curTime - frameRateInfo.lastUpdateTime >= 1000) {
    updateFrameRate(frameRateInfo.frameCountSinceUpdate);
    frameRateInfo.frameCountSinceUpdate = 0;
    frameRateInfo.lastUpdateTime = curTime;
  }
  frameRateInfo.frameCountSinceUpdate++;
  const deltaTime = Math.min(curTime - lastTime, 30) / 1000;
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
  if (currentConfig.field) field.draw(ctx);
  ctx.font = "20px monospace";
  ctx.fillStyle = "white";
  stars = stars.filter((star) => !star.markedForDeletion);
  updateStarCount(stars.length);
  requestAnimationFrame(draw);
}
