import {
  SimpleSpriteBatchPullable,
  SimpleSpriteBatchRenderable,
  SimpleSpriteBatch,
  SimpleSpriteBatchData,
} from './SimpleSpriteBatch';
import { vec2, vec4 } from 'gl-matrix';
import { SubTexture } from '../SubTexture';
import { SimpleElement } from './SimpleElement';
import { SimpleGroup } from './SimpleGroup';
import { SimpleWorldCoords } from './SimpleWorldCoords';

export class SimpleSprite extends SimpleElement implements SimpleSpriteBatchPullable {
  constructor(protected _subTexture: SubTexture) {
    super(_subTexture.glTexture);
  }

  get subTexture(): SubTexture {
    return this._subTexture;
  }

  set subTexture(val: SubTexture) {
    if (this._subTexture !== val) {
      this._subTexture = val;
      this._texture = val.glTexture.texture;
    }
  }

  draw(batch: SimpleSpriteBatch, parentWorldCoords?: SimpleWorldCoords): void {
    this.calcWorldCoordinate(parentWorldCoords);
    batch.push(6, 4, this._texture, this);
  }

  pull(
    batch: SimpleSpriteBatch,
    vertices: SimpleSpriteBatchData[],
    indices: Uint16Array,
    vertexIndex: number,
    indicesIndex: number,
  ): void {
    const v0 = vertices[vertexIndex];
    const v1 = vertices[vertexIndex + 1];
    const v2 = vertices[vertexIndex + 2];
    const v3 = vertices[vertexIndex + 3];

    const left: number = this.position[0];
    const right: number = this.position[0] + this._subTexture.width;
    const top: number = this.position[1];
    const bottom: number = this.position[1] + this._subTexture.height;

    const uvs = this._subTexture.uv;

    vec2.set(v0.pos, left, top);
    vec2.set(v1.pos, right, top);
    vec2.set(v2.pos, left, bottom);
    vec2.set(v3.pos, right, bottom);

    vec2.set(v0.uv, uvs[0], uvs[1]);
    vec2.set(v1.uv, uvs[2], uvs[1]);
    vec2.set(v2.uv, uvs[0], uvs[3]);
    vec2.set(v3.uv, uvs[2], uvs[3]);

    // vec4.copy(v0.color, this.color);
    // vec4.copy(v1.color, this.color);
    // vec4.copy(v2.color, this.color);
    // vec4.copy(v3.color, this.color);

    indices[indicesIndex] = vertexIndex;
    indices[indicesIndex + 1] = vertexIndex + 1;
    indices[indicesIndex + 2] = vertexIndex + 2;
    indices[indicesIndex + 3] = vertexIndex + 1;
    indices[indicesIndex + 4] = vertexIndex + 3;
    indices[indicesIndex + 5] = vertexIndex + 2;
  }
}
