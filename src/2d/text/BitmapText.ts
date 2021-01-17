import { vec2, vec4 } from 'gl-matrix';
import { rect } from '../../geom/rect';
import BitmapFont from './BitmapFont';
import { Poly } from '../sprite/Poly';
import { SpriteBatch, ISpriteBatchPullable, SpriteBatchData } from '../SpriteBatch';
import { WorldCoords } from '../sprite/ElementData';
import { SpriteElement } from '../sprite/SpriteElement';
import { BitmapFontRaw, fontDataStride } from './BitmapFontRaw';

export enum Align {
  left = 0,
  right = 1,
  center = 2,
}

const vec2_1 = vec2.create();
const vec2_2 = vec2.create();

// let worldMat = Poly.__worldMat;
// let invWorldMat = Poly.__invWworldMat;

const rect_1 = rect.create();

const maxChars = 10000;
const uvBufferSize = 8 * maxChars;
const positionBufferSize = 8 * maxChars;

// /**
//  * @class
//  * @memberOf Text
//  * */
export default class BitmapText extends SpriteElement implements ISpriteBatchPullable {
  protected _dirty = true;
  protected _positionBuffer: Float32Array;
  protected _uvBuffer: Float32Array;
  // protected _transform: vec2;
  protected _width = 0;
  protected _height = 0;
  protected _fontSize = 0;
  protected _lineHeight = 0;

  protected _nbTriangles = 0;
  protected _nbPoints = 0;

  protected _align = Align.left;
  protected _color = vec4.create();
  private _vecs: vec2[];
  private _uvs: vec2[];

  //   static createText(
  //     font,
  //     fontSize,
  //     lineHeight,
  //     align = Align.left,
  //     color = null,
  //     text = '',
  //     wordWrap = false,
  //     autoHeight = true,
  //   ) {
  //     var textField = new this(font, text, wordWrap, autoHeight);
  //     textField.fontSize = fontSize;
  //     textField.lineHeight = lineHeight;

  //     if (color !== null) textField.color = color;

  //     textField.align = align;

  //     // debugger;
  //     return textField;
  //   }

  constructor(
    protected _font: BitmapFontRaw,
    protected _text = '',
    protected _wordWrap = false,
    protected _autoHeight = true,
  ) {
    super(_font.texture.glTexture);

    /**
     * @type {Float32Array}
     */
    this._positionBuffer = new Float32Array(uvBufferSize);
    this._vecs = new Array(uvBufferSize / 2);
    for (let i = 0; i < this._vecs.length; i++) {
      this._vecs[i] = new Float32Array(this._positionBuffer.buffer, Float32Array.BYTES_PER_ELEMENT * i * 2, 2) as vec2;
    }

    /**
     * @type {Float32Array}
     */
    this._uvBuffer = new Float32Array(positionBufferSize);
    this._uvs = new Array(positionBufferSize / 2);
    for (let i = 0; i < this._uvs.length; i++) {
      this._uvs[i] = new Float32Array(this._uvBuffer.buffer, Float32Array.BYTES_PER_ELEMENT * i * 2, 2) as vec2;
    }
    // this._transform.area = vec2.create();

    this._reset();
  }

  /**
   * @private
   */
  _reset(): void {
    this._width = 0;
    this._height = 0;
    this._fontSize = this.font.baseFontSize as number;
    this._lineHeight = this.font.baseLineHeight as number;
    this._align = Align.left;

    vec4.set(this._color, 0, 0, 0, 1);
  }

  reset(): void {
    // super.reset();
    this.autoHeight = true;

    this._reset();
  }

  /**
   * @returns {bool}
   */
  get autoHeight(): boolean {
    return this._autoHeight;
  }

  /**
   * @param {bool} value
   */
  set autoHeight(value) {
    if (value !== this._autoHeight) {
      this._dirty = true;
      this._autoHeight = value;
    }
  }

  get font(): BitmapFontRaw {
    return this._font;
  }

  /**
   * @param {BitmapFont} value
   */
  set font(value) {
    this._dirty = true;
    this._font = value;
  }

  /**
   * @returns {Number}
   */
  get lineHeight(): number {
    return this._lineHeight;
  }

  /**
   * @param {Number} value
   */

  set lineHeight(value: number) {
    this._dirty = true;
    this._lineHeight = value;
  }

  /**
   * @returns {int}
   */
  get fontSize(): number {
    return this._fontSize;
  }

  /**
   * @param {int} value
   */
  set fontSize(value: number) {
    this._dirty = true;
    this._fontSize = value;
  }

  /**
   * @returns {string}
   */
  get text(): string {
    return this._text;
  }

  /**
   * @param {string} value
   */
  set text(value: string) {
    this._dirty = true;
    this._text = value;
  }

  /**
   * @returns {number}
   */
  get width(): number {
    return this._width;
  }

  /**
   * @param {number} value
   */
  set width(value: number) {
    if (value !== this._width) {
      this._dirty = true;
      // this._transform.size[0] = value;
      this._width = value;
    }
  }

  /**
   * @returns {number}
   */
  get height(): number {
    return this._height;
  }

  /**
   * @param {number} value
   */
  set height(value: number) {
    if (value !== this._height && !this._autoHeight) {
      this._dirty = true;
      // this.transform.area[1] = value;
      this._height = value;
    }
  }

  /**
   * @returns {int}
   */
  get align(): Align {
    return this._align;
  }

  /**
   * @param {int} value
   */
  set align(value: Align) {
    this._dirty = true;

    this._align = value;
  }

  /**
   * @returns {bool}
   */
  get wordWrap(): boolean {
    return this._wordWrap;
  }

  /**
   * @param {bool} value
   */
  set wordWrap(value: boolean) {
    this._dirty = true;

    this._wordWrap = value;
  }

  /**
   * @param {Batch} batch
   * @returns {boolean}
   */
  // needToCompletePreviousBatch(batch) {
  //   return batch.material.texture !== this.font.texture.texture;
  // }

  // /**
  //  * @param {vec2} cursorPos
  //  * @param {int} lgbI
  //  * @param {int} gbI
  //  * @private
  //  */

  _newLine(cursorPos: vec2, lgbI: number, gbI: number): void {
    this._alignLine(cursorPos, lgbI, gbI);

    cursorPos[0] = 0;
    cursorPos[1] += this.lineHeight;
  }

  /**
   * @param {vec2} cursorPos
   * @param {int} lgbI
   * @param {int} gbI
   * @private
   */
  _alignLine(cursorPos: vec2, lgbI: number, gbI: number) {
    const lineWidth = this._positionBuffer[gbI - 2];
    let alignPadding = 0;

    switch (this.align) {
      case Align.right:
        alignPadding = this._width - lineWidth;
        break;
      case Align.center:
        alignPadding = (this._width - lineWidth) / 2;
        break;
    }

    if (alignPadding !== 0) {
      for (let i = lgbI; i < gbI; i += 2) this._positionBuffer[i] += alignPadding;
    }
  }

  updateLocalGeometry(): void {
    console.log('> updateLocalGeometry');
    this._dirty = false;

    const raw = this.font.raw;
    const fontScale = this.fontSize / (this.font.baseFontSize as number);

    const cursorPos = vec2_1;
    vec2.set(cursorPos, 0, 0);

    let xOffset = 0,
      yOffset = 0,
      xAdvance = 0,
      x = 0,
      y = 0,
      w = 0,
      h = 0,
      l = 0,
      t = 0,
      r = 0,
      b = 0;

    let lgbi = 0;
    let gbi = 0; // GeometryBufferIndex

    const posB = this._positionBuffer;
    const uvB = this._uvBuffer;

    const lineHeightOffset = (this.lineHeight - this.fontSize) / 2;

    for (let i = 0; i < this._text.length; i++) {
      if (this._text[i] === '\n') {
        this._newLine(cursorPos, lgbi, gbi);
        lgbi = gbi;
        continue;
      }

      const charCode = this._text.charCodeAt(i);
      for (let f = 0; f < raw.length; f += fontDataStride) {
        if (raw[f] === charCode) {
          // get char data
          xOffset = raw[f + 1];
          yOffset = raw[f + 2];
          xAdvance = raw[f + 3];
          x = raw[f + 4];
          y = raw[f + 5];
          w = raw[f + 6];
          h = raw[f + 7];
          l = raw[f + 8];
          t = raw[f + 9];
          r = raw[f + 10];
          b = raw[f + 11];

          // handle wordwrap

          if (this.wordWrap && this.width > 0 && cursorPos[0] + xAdvance * fontScale >= this.width) {
            this._newLine(cursorPos, lgbi, gbi);
            lgbi = gbi;
          }

          // calculate quad geom
          posB[gbi] = posB[gbi + 4] = cursorPos[0] + xOffset * fontScale;
          posB[gbi + 2] = posB[gbi + 6] = cursorPos[0] + (w + xOffset) * fontScale;
          posB[gbi + 1] = posB[gbi + 3] = cursorPos[1] + yOffset * fontScale + lineHeightOffset;
          posB[gbi + 5] = posB[gbi + 7] = cursorPos[1] + (yOffset + h) * fontScale + lineHeightOffset;

          // copy uvs
          uvB[gbi] = uvB[gbi + 4] = l;
          uvB[gbi + 2] = uvB[gbi + 6] = r;
          uvB[gbi + 1] = uvB[gbi + 3] = t;
          uvB[gbi + 5] = uvB[gbi + 7] = b;

          // increment buffer index
          gbi += 8;

          cursorPos[0] += xAdvance * fontScale;

          break;
        }
      }
    }

    this._alignLine(cursorPos, lgbi, gbi);

    // debugger;

    this._nbTriangles = gbi / 4;
    this._nbPoints = gbi / 2;

    // this._nbPointsToRender = this.nbPoints;
    // this._nbTrianglesToRender = this.nbTriangles;

    if (this._autoHeight) {
      this._height = cursorPos[1] + this.lineHeight;
      // this._transform.size[1] = this._height;
    }
  }

  // /**
  //  * @param {Batch} batch
  //  */
  // setupNewBatch(batch) {
  //   batch.material.texture = this.font.texture.texture;
  // }

  /**
   * @param {Batch} batch
   * @param {mat2d} parentMat
   * @param {bool} fastTransform
   */
  // updateBatchGeom(batch, parentMat, fastTransform) {
  //   if (!fastTransform) {
  //     this._transform.updateWorldMat(worldMat, parentMat);

  //     if (this._transform.size[0] !== 0) this._width = this._transform.size[0];
  //     else if (this._transform.requestedSize[0] !== 0) this._width = this._transform.requestedSize[0];
  //   }

  //   if (this._dirty) this.updateLocalGeometry();

  //   const posB = this._positionBuffer;
  //   const uvB = this._uvBuffer;
  //   let f = 0;
  //   let vertex;
  //   let attr;

  //   for (attr of batch._attributes) {
  //     if (attr.name === 'position') {
  //       // POSITION
  //       for (f = 0; f < this.nbPoints; f++) {
  //         vertex = attr.vertices[f + batch.pointsIndex];

  //         if (!fastTransform) {
  //           vec2_1[0] = posB[f * 2];
  //           vec2_1[1] = posB[f * 2 + 1];

  //           vec2.transformMat2d(vertex, vec2_1, worldMat);
  //         } else {
  //           vec2.set(
  //             vertex,
  //             posB[f * 2] + this._transform.position[0] + this.parent.transform.position[0],
  //             posB[f * 2 + 1] + this._transform.position[1] + this.parent.transform.position[1],
  //           );
  //         }
  //       }
  //     } else if (attr.name === 'uv') {
  //       // UV =======
  //       for (f = 0; f < this.nbPoints; f++) vec2.set(attr.vertices[f + batch.pointsIndex], uvB[f * 2], uvB[f * 2 + 1]);
  //     } else if (attr.name === 'color') {
  //       // COLOR ======
  //       for (f = 0; f < this.nbPoints; f++) vec4.copy(attr.vertices[f + batch.pointsIndex], this._globalColor);
  //     }
  //   }

  //   let indexArray = batch.mesh.indexBuffer.data;

  //   for (let i = 0; i < this.nbTriangles / 2; i++) {
  //     const pt1 = i * 4 + batch.pointsIndex + 2;
  //     const pt2 = i * 4 + batch.pointsIndex + 3;
  //     const pt3 = i * 4 + batch.pointsIndex;
  //     const pt4 = i * 4 + batch.pointsIndex + 1;

  //     indexArray[i * 6 + batch.elementsIndex * 3] = pt1;
  //     indexArray[i * 6 + batch.elementsIndex * 3 + 1] = pt2;
  //     indexArray[i * 6 + batch.elementsIndex * 3 + 2] = pt3;
  //     indexArray[i * 6 + batch.elementsIndex * 3 + 3] = pt2;
  //     indexArray[i * 6 + batch.elementsIndex * 3 + 4] = pt4;
  //     indexArray[i * 6 + batch.elementsIndex * 3 + 5] = pt3;
  //   }
  // }

  draw(batch: SpriteBatch, parentWorldCoords?: WorldCoords): void {
    this.calcWorldCoordinate(parentWorldCoords);
    batch.push(this._nbTriangles * 3, this._nbPoints, this._texture, this);
  }

  pull(
    batch: SpriteBatch,
    vertices: SpriteBatchData[],
    indices: Uint16Array,
    vertexIndex: number,
    indicesIndex: number,
  ): void {
    if (this._dirty) this.updateLocalGeometry();

    // const posB = this._positionBuffer;
    // const uvB = this._uvBuffer;
    // let vertex;
    // let attr;
    const transform = this._worldCoords.transform;
    const color = this._worldCoords.color;
    const vecs = this._vecs;
    const uvs = this._uvs;

    // Vertex
    for (let i = 0; i < this._nbPoints; i++) {
      // position
      const vert = vertices[i + vertexIndex];
      vec2.transformMat2d(vert.pos, vecs[i], transform);

      // uvs
      vec2.copy(vert.uv, uvs[i]);

      // color
      vec4.copy(vert.color, color);
    }

    // Indices

    // for (attr of batch._attributes) {
    //   if (attr.name === 'position') {
    //     // POSITION
    //     for (f = 0; f < this.nbPoints; f++) {
    //       vertex = attr.vertices[f + batch.pointsIndex];

    //       if (!fastTransform) {
    //         vec2_1[0] = posB[f * 2];
    //         vec2_1[1] = posB[f * 2 + 1];

    //         vec2.transformMat2d(vertex, vec2_1, worldMat);
    //       } else {
    //         vec2.set(
    //           vertex,
    //           posB[f * 2] + this._transform.position[0] + this.parent.transform.position[0],
    //           posB[f * 2 + 1] + this._transform.position[1] + this.parent.transform.position[1],
    //         );
    //       }
    //     }
    //   } else if (attr.name === 'uv') {
    //     // UV =======
    //     for (f = 0; f < this.nbPoints; f++) vec2.set(attr.vertices[f + batch.pointsIndex], uvB[f * 2], uvB[f * 2 + 1]);
    //   } else if (attr.name === 'color') {
    //     // COLOR ======
    //     for (f = 0; f < this.nbPoints; f++) vec4.copy(attr.vertices[f + batch.pointsIndex], this._globalColor);
    //   }
    // }

    // let indexArray = batch.mesh.indexBuffer.data;

    for (let i = 0; i < this._nbTriangles / 2; i++) {
      const pt1 = i * 4 + vertexIndex + 2;
      const pt2 = i * 4 + vertexIndex + 3;
      const pt3 = i * 4 + vertexIndex;
      const pt4 = i * 4 + vertexIndex + 1;

      indices[i * 6 + indicesIndex * 3] = pt1;
      indices[i * 6 + indicesIndex * 3 + 1] = pt2;
      indices[i * 6 + indicesIndex * 3 + 2] = pt3;
      indices[i * 6 + indicesIndex * 3 + 3] = pt2;
      indices[i * 6 + indicesIndex * 3 + 4] = pt4;
      indices[i * 6 + indicesIndex * 3 + 5] = pt3;
    }
  }
}
