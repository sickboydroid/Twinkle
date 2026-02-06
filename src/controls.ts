import { ctx, stars, WORLD_HEIGHT, WORLD_WIDTH } from "./main";

interface StarData {
  mass: number;
  radius: number;
  vx: number;
  vy: number;
  fixed: boolean;
}

const DEFAULTS: StarData = {
  mass: 10000,
  radius: 5,
  vx: 0,
  vy: 0,
  fixed: false,
};

// Reactive Object holds most recent info given by user
export const currentStarData: StarData = { ...DEFAULTS };

const inputs = {
  mass: document.getElementById("mass") as HTMLInputElement,
  radius: document.getElementById("radius") as HTMLInputElement,
  vx: document.getElementById("vx") as HTMLInputElement,
  vy: document.getElementById("vy") as HTMLInputElement,
  fixed: document.getElementById("fixed") as HTMLInputElement,
  count: document.getElementById("star-count") as HTMLElement,
  clearBtn: document.getElementById("clear-btn") as HTMLButtonElement,
};

/**
 * Validates input and updates the data object.
 * Adds visual error feedback if input is invalid
 */
const updateData = (key: keyof StarData, element: HTMLInputElement) => {
  if (key === "fixed") {
    currentStarData.fixed = element.checked;
    return;
  }

  const val = parseFloat(element.value);

  if (isNaN(val)) {
    element.classList.add("error");
  } else {
    element.classList.remove("error");
    currentStarData[key] = val;
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
