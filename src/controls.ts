import { ctx, stars, toggleWalls, WORLD_HEIGHT, WORLD_WIDTH } from "./main";

interface Config {
  mass: number;
  radius: number;
  vx: number;
  vy: number;
  fixed: boolean;
  walls: boolean;
  field: boolean;
  collisions: boolean;
  trail: boolean;
}

const DEFAULTS: Config = {
  mass: 50000,
  radius: 5,
  vx: 0,
  vy: 0,
  fixed: false,
  walls: true,
  field: false,
  collisions: false,
  trail: true,
};

// Reactive Object holds most recent info given by user
export const currentConfig: Config = { ...DEFAULTS };

const inputs = {
  mass: document.getElementById("mass") as HTMLInputElement,
  radius: document.getElementById("radius") as HTMLInputElement,
  vx: document.getElementById("vx") as HTMLInputElement,
  vy: document.getElementById("vy") as HTMLInputElement,
  count: document.getElementById("star-count") as HTMLElement,
  frameRate: document.getElementById("frame-rate") as HTMLElement,
  clearBtn: document.getElementById("clear-btn") as HTMLButtonElement,
  fixed: document.getElementById("fixed") as HTMLInputElement,
  walls: document.getElementById("walls") as HTMLInputElement,
  field: document.getElementById("field") as HTMLInputElement,
  collisions: document.getElementById("collisions") as HTMLInputElement,
  trail: document.getElementById("trail") as HTMLInputElement,
};

/**
 * Validates input and updates the data object.
 * Adds visual error feedback if input is invalid
 */
const updateData = (key: keyof Config, element: HTMLInputElement) => {
  if (key === "fixed") {
    currentConfig.fixed = element.checked;
  } else if (key == "walls") {
    currentConfig.walls = element.checked;
  } else if (key == "collisions") {
    currentConfig.collisions = element.checked;
  } else if (key == "field") {
    currentConfig.field = element.checked;
    if (currentConfig.field && currentConfig.trail) {
      currentConfig.trail = false;
      inputs.trail.checked = false;
    }
  } else if (key == "trail") {
    currentConfig.trail = element.checked;
    if (currentConfig.trail && currentConfig.field) {
      // FIXME: Use some flag to let draw function know that it has to clear once even though trail is on
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      currentConfig.field = false;
      inputs.field.checked = false;
    }
  } else {
    const val = parseFloat(element.value);
    if (isNaN(val)) {
      element.classList.add("error");
    } else {
      element.classList.remove("error");
      currentConfig[key] = val;
    }
  }
};

/**
 * Initializes inputs with default values
 */
export const initControls = () => {
  // Set visual defaults
  inputs.mass.value = DEFAULTS.mass.toString();
  inputs.radius.value = DEFAULTS.radius.toString();
  inputs.vx.value = DEFAULTS.vx.toString();
  inputs.vy.value = DEFAULTS.vy.toString();
  inputs.fixed.checked = DEFAULTS.fixed;
  inputs.walls.checked = DEFAULTS.walls;
  inputs.collisions.checked = DEFAULTS.collisions;
  inputs.field.checked = DEFAULTS.field;
  inputs.trail.checked = DEFAULTS.trail;

  // Bind Listeners
  inputs.mass.addEventListener("input", () => updateData("mass", inputs.mass));
  inputs.radius.addEventListener("input", () =>
    updateData("radius", inputs.radius),
  );
  inputs.vx.addEventListener("input", () => updateData("vx", inputs.vx));
  inputs.vy.addEventListener("input", () => updateData("vy", inputs.vy));
  inputs.fixed.addEventListener("change", () =>
    updateData("fixed", inputs.fixed),
  );
  inputs.walls.addEventListener("change", () => {
    updateData("walls", inputs.walls);
    toggleWalls();
  });
  inputs.collisions.addEventListener("change", () =>
    updateData("collisions", inputs.collisions),
  );
  inputs.field.addEventListener("change", () => {
    updateData("field", inputs.field);
  });
  inputs.trail.addEventListener("change", () =>
    updateData("trail", inputs.trail),
  );
  inputs.clearBtn.addEventListener("click", () => {
    ctx.fillStyle = "#282828";
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    stars.length = 0;
    console.log("Clear requested");
  });
};

export const updateStarCount = (count: number) => {
  if (inputs.count) inputs.count.innerText = count.toString();
};

export const updateFrameRate = (count: number) => {
  if (inputs.frameRate) inputs.frameRate.innerText = count.toString();
};
