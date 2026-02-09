import { stars, WORLD_HEIGHT, WORLD_WIDTH } from "./main";

type Color = "black" | "green" | "blue" | "yellow" | "orange" | "red";

export default class Feild {
  arrowImages: Record<Color, HTMLImageElement>;
  constructor() {
    this.arrowImages = {
      black: new Image(),
      green: new Image(),
      blue: new Image(),
      yellow: new Image(),
      orange: new Image(),
      red: new Image(),
    };
    let promises: Promise<void>[] = [];
    for (const [color, image] of Object.entries(this.arrowImages)) {
      image.src = `arrow_${color}.png`;
      promises.push(
        image
          .decode()
          .catch((reason) => console.log(`${image.src} cannot be decoded`)),
      );
    }
    Promise.all(promises);
  }
  getStrengthColor(s: number, sMin: number, sMax: number): Color {
    s = Math.max(sMin, Math.min(s, sMax));
    const t = (s - sMin) / (sMax - sMin);
    if (t < 0.01) return "black";
    if (t < 0.05) return "green";
    if (t < 0.3) return "blue";
    if (t < 0.7) return "yellow";
    if (t < 0.95) return "orange";
    return "red";
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let r = 0; r < WORLD_WIDTH; r += 20) {
      for (let c = 0; c < WORLD_HEIGHT; c += 20) {
        let [netGx, netGy] = [0, 0];
        for (const star of stars) {
          const [gx, gy] = star.getGravitationalFieldAt(r, c);
          netGx += gx;
          netGy += gy;
        }
        const strengthSqr = netGx * netGx + netGy * netGy;
        const hypot = Math.sqrt(netGx * netGx + netGy * netGy);
        const cos = hypot == 0 ? 1 : netGx / hypot;
        const sin = hypot == 0 ? 0 : netGy / hypot;
        const image =
          this.arrowImages[this.getStrengthColor(strengthSqr, 0, 10000000)];
        ctx.setTransform(cos, sin, -sin, cos, r, c);
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 18, 18);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
    }
  }
}
