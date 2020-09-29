import { SpriteElement } from './SpriteElement';
import { SpriteBatch, ISpriteBatchPullable, SpriteBatchData } from '../SpriteBatch';
import { WorldCoords } from './ElementData';
import { vec2 } from 'gl-matrix';

export class Quad extends SpriteElement implements ISpriteBatchPullable {
  private _quad = new Float32Array(8);
  private _p0: vec2 = new Float32Array(this._quad.buffer, 0, 2) as any;
  private _p1: vec2 = new Float32Array(this._quad.buffer, 2 * Float32Array.BYTES_PER_ELEMENT, 2) as any;
  private _p2: vec2 = new Float32Array(this._quad.buffer, 4 * Float32Array.BYTES_PER_ELEMENT, 2) as any;
  private _p3: vec2 = new Float32Array(this._quad.buffer, 6 * Float32Array.BYTES_PER_ELEMENT, 2) as any;

  protected _uvs = new Float32Array(4);

  draw(batch: SpriteBatch, parentWorldCoords?: WorldCoords): void {
    this.calcWorldCoordinate(parentWorldCoords);
    batch.push(6, 4, this._texture, this);
  }

  resize(width: number, height: number): boolean {
    const res = super.resize(width, height);
    if (res === true) {
      const quad = this._quad;

      quad[0] = quad[4] = 0;
      quad[1] = quad[3] = 0;
      quad[2] = quad[6] = width;
      quad[5] = quad[7] = height;
    }
    return res;
  }

  pull(
    batch: SpriteBatch,
    vertices: SpriteBatchData[],
    indices: Uint16Array,
    vertexIndex: number,
    indicesIndex: number,
  ): void {
    const v0 = vertices[vertexIndex];
    const v1 = vertices[vertexIndex + 1];
    const v2 = vertices[vertexIndex + 2];
    const v3 = vertices[vertexIndex + 3];

    const transform = this._worldCoords.transform;
    const color = this._worldCoords.color;

    const uvs = this._uvs;

    vec2.transformMat2d(v0.pos, this._p0, transform);
    vec2.transformMat2d(v1.pos, this._p1, transform);
    vec2.transformMat2d(v2.pos, this._p2, transform);
    vec2.transformMat2d(v3.pos, this._p3, transform);

    v0.color.set(color);
    v1.color.set(color);
    v2.color.set(color);
    v3.color.set(color);

    vec2.set(v0.uv, uvs[0], uvs[1]);
    vec2.set(v1.uv, uvs[2], uvs[1]);
    vec2.set(v2.uv, uvs[0], uvs[3]);
    vec2.set(v3.uv, uvs[2], uvs[3]);

    indices[indicesIndex] = vertexIndex;
    indices[indicesIndex + 1] = vertexIndex + 1;
    indices[indicesIndex + 2] = vertexIndex + 2;
    indices[indicesIndex + 3] = vertexIndex + 1;
    indices[indicesIndex + 4] = vertexIndex + 3;
    indices[indicesIndex + 5] = vertexIndex + 2;
  }
}
