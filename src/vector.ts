export default class Vector {
  x = 0;
  y = 0;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  scale(scaler: number) {
    return new Vector(this.x * scaler, this.y * scaler);
  }

  dot(other: Vector) {
    return this.x * other.x + this.y * other.y;
  }

  component(axis: Vector) {
    axis = axis.unit();
    return axis.scale(this.dot(axis));
  }

  /**
   * Returns *perp* which is perpendicular to *axis* and *parallel*
   * which is parallel to *axis* such that *perp + prallel = this*
   **/
  resolve(axis: Vector): { perp: Vector; parallel: Vector } {
    axis = axis.unit();
    const parallel = this.component(axis);
    return {
      perp: this.subtract(parallel),
      parallel,
    };
  }

  /**
   * @returns unit vector along current vector
   */
  unit(): Vector {
    const mag = this.magnitude();
    if (mag == 0) return Vector.zero();
    return new Vector(this.x / mag, this.y / mag);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  static zero() {
    return new Vector(0, 0);
  }
}
