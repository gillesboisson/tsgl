import { vec2 } from 'gl-matrix';

export class rect extends Float32Array {
  static create(): rect {
    return new Float32Array(4) as any;
  }

  static fromValues(x: number, y: number, width: number, height: number): rect {
    return new Float32Array([x, y, x + width, y + height]) as any;
  }
  static fromRect(rect: rect): rect {
    return new Float32Array([rect[0], rect[1], rect[2], rect[3]]) as any;
  }

  static merge(out: rect, rect1: rect, rect2: rect): void {
    const x0 = rect1[0] < rect2[0] ? rect1[0] : rect2[0];
    const y0 = rect1[1] < rect2[1] ? rect1[1] : rect2[1];

    const x1 = rect1[2] > rect2[2] ? rect1[2] : rect2[2];
    const y1 = rect1[3] > rect2[3] ? rect1[3] : rect2[3];

    out[0] = x0;
    out[1] = y0;
    out[2] = x1;
    out[3] = y1;
  }

  static copy(out: rect, rect: rect): rect {
    out[0] = rect[0];
    out[1] = rect[1];
    out[2] = rect[2];
    out[3] = rect[3];

    return out;
  }

  static moveTo(out: rect, position: rect): rect {
    out[0] = position[0];
    out[1] = position[1];

    return out;
  }

  static resize(out: rect, size: vec2): rect {
    out[2] = out[0] + size[0];
    out[3] = out[1] + size[1];

    return out;
  }

  static contain(rect1: rect, rect2: rect): boolean {
    return rect1[0] <= rect2[0] && rect1[1] <= rect2[1] && rect1[2] >= rect2[2] && rect1[3] >= rect2[3];
  }

  static resetFromPoint(out: rect, pos: vec2): void {
    out[0] = pos[0];
    out[1] = pos[1];
    out[2] = pos[0];
    out[3] = pos[1];
  }

  static includePoint(out: rect, pos: vec2) {
    if (out[0] > pos[0]) out[0] = pos[0];
    if (out[1] > pos[1]) out[1] = pos[1];

    if (out[2] < pos[0]) out[2] = pos[0];

    if (out[3] < pos[1]) out[3] = pos[1];
  }

  static containPoint(rect1: rect, vec1: rect): boolean {
    return vec1[0] >= rect1[0] && vec1[0] <= rect1[2] && vec1[1] >= rect1[1] && vec1[1] <= rect1[3];
  }
  static hit(rect1: rect, rect2: rect): boolean {
    return rect1[0] < rect2[2] && rect1[2] > rect2[0] && rect1[1] < rect2[3] && rect1[3] > rect2[1];
  }

  static setRect(out: rect, left: number, top: number, right: number, bottom: number): rect {
    out[0] = left;
    out[1] = top;
    out[2] = right;
    out[3] = bottom;

    return out;
  }
  static set(out: rect, x: number, y: number, width: number, height: number): rect {
    out[0] = x;
    out[1] = y;
    out[2] = x + width;
    out[3] = y + height;

    return out;
  }
}
