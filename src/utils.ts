export function randomBrightColor() {
  const h = Math.random() * 360;
  const s = 80 + Math.random() * 20;
  const l = 50 + Math.random() * 10;
  return `hsl(${h}, ${s}%, ${l}%)`;
}
