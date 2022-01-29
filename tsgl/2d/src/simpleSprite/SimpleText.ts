/* eslint-disable @typescript-eslint/no-unused-vars */
import { SimpleElement } from './SimpleSpriteElement';
import { SubTexture } from '../SubTexture';
import { ISpriteBatchPullable, SpriteBatch, SpriteBatchData } from '../SpriteBatch';

export enum SimpleTextOverflow {
  WORD_WRAP,
  HIDDEN,
  SCROLL,
}

export class SimpleTextFont {
  protected _glyphs: string[];
  protected _glyphGeom: Float32Array;

  get texture(): SubTexture {
    return this._texture;
  }

  get glyphWidth(): number {
    return this._glyphWidth;
  }

  get glyphHeight(): number {
    return this._glyphHeight;
  }

  get glyphGeom(): Float32Array {
    return this._glyphGeom;
  }
  get glyphs(): string[] {
    return this._glyphs;
  }

  constructor(
    protected _texture: SubTexture,
    glyphs: string,
    protected _glyphWidth: number,
    protected _glyphHeight: number,
  ) {
    const glTextureWidth = _texture.glTexture.width;
    const glTextureHeight = _texture.glTexture.height;
    this._glyphs = glyphs.split('');
    const glyphGeom = (this._glyphGeom = new Float32Array(glyphs.length * 4));

    const glyphUVWidth = _glyphWidth / glTextureWidth;
    const glyphUVHeight = _glyphHeight / glTextureHeight;

    for (let i = 0; i < glyphs.length; i++) {
      const ind = i * 4;
      glyphGeom[ind] = (((i * _glyphWidth + _texture.x) % _texture.width) + _texture.x) / glTextureWidth;
      glyphGeom[ind + 1] = glyphGeom[ind] + glyphUVWidth;
      glyphGeom[ind + 2] =
        (Math.floor((i * _glyphWidth) / _texture.width) * _glyphHeight + _texture.y) / glTextureHeight;
      glyphGeom[ind + 3] = glyphGeom[ind + 2] + glyphUVHeight;
    }
  }
}

export class SimpleText extends SimpleElement implements ISpriteBatchPullable {
  protected _width = -1;
  protected _height = -1;

  protected _text: string;
  protected _textDirty = false;
  protected _wordSizes: number[] = [];

  public upperCaseOnly = false;

  get text(): string {
    return this._text;
  }

  set text(val: string) {
    if (this._text !== val) {
      this._text = this.upperCaseOnly ? val.toUpperCase() : val;
      this._textDirty = true;
    }
  }

  get width(): number {
    return this._width;
  }

  set width(val: number) {
    if (this._width !== val) {
      this._width = val < 0 ? -1 : Math.ceil(val / this.font.glyphWidth) * this.font.glyphWidth;
    }
  }
  get height(): number {
    return this._height;
  }

  set height(val: number) {
    if (this._height !== val) {
      this._height = val < 0 ? -1 : Math.ceil(val / this.font.glyphHeight) * this.font.glyphHeight;
    }
  }

  constructor(protected font: SimpleTextFont) {
    super(font.texture.glTexture);
  }

  draw(batch: SpriteBatch, parentWorldCoords?: import('./SimpleElementData').SimpleWorldCoords): void {
    if (this._text.length === 0) return;
    const nbElements = this.text.length;
    this.calcWorldCoordinate(parentWorldCoords);

    if (this._textDirty) {
      this.calcWordsSize();
      this._textDirty = false;
    }

    batch.push(nbElements * 6, nbElements * 4, this._texture, this);
  }

  calcWordsSize(): void {
    const words = this._text.split('\n').join(' ').split(' ');
    this._wordSizes = words.map((word) => word.length);
  }

  pull(
    batch: SpriteBatch,
    vertices: SpriteBatchData[],
    indices: Uint16Array,
    vertexIndex: number,
    indicesIndex: number,
  ): void {
    const nbElements = this.text.length;
    const nbMaxIndices = nbElements * 6;
    const nbMaxVertices = nbElements * 4;
    const baseVertexIndex = vertexIndex;
    const baseIndiceIndex = indicesIndex;

    // geom constants
    const i0 = vertexIndex;
    const i1 = i0 + this.text.length * 4;
    const glyphGeom = this.font.glyphGeom;
    const glyphs = this.font.glyphs;
    const glyphWidth = this.font.glyphWidth;
    const glyphHeight = this.font.glyphHeight;

    // coords
    const color = this._worldCoords.color;
    const x = this._worldCoords.x;
    const y = this._worldCoords.y;
    const width = this._width;
    const height = this._height;

    // chars coords
    const wordSizes = this._wordSizes;
    let charPosition;
    let charX = 0;
    let charY = 0;
    let currentWordIndex = 0;
    let currentWordSize: number = wordSizes[0];

    const maxCharX = width !== -1 ? width / glyphWidth : -1;
    const maxCharY = height !== -1 ? height / glyphHeight : -1;

    let lastLineReturnWasWordWrap = false; // use to avoid double line return

    for (let i = i0; i < i1; i += 4) {
      const v0 = vertices[vertexIndex];
      const v1 = vertices[vertexIndex + 1];
      const v2 = vertices[vertexIndex + 2];
      const v3 = vertices[vertexIndex + 3];

      charPosition = (i - i0) / 4;

      const char = this.text.charAt(charPosition);

      // shift to next word
      if (char === ' ' || char === '\n') {
        currentWordIndex++;
        currentWordSize = wordSizes[currentWordIndex];
        const autoLineReturn = charX + currentWordSize >= maxCharX;

        // handle line return by detecting \n or word wrap auto line return
        if (char === '\n' || (maxCharX !== -1 && charX + currentWordSize >= maxCharX)) {
          if (charX !== 0 && (autoLineReturn || lastLineReturnWasWordWrap)) {
            charY++;
            charX = 0;
          }

          continue;
          // TODO: implement clipping
        }

        lastLineReturnWasWordWrap = autoLineReturn;
      } else lastLineReturnWasWordWrap = false;

      const charInd = glyphs.indexOf(char);

      if (charInd !== -1) {
        const glyphGeomInd = charInd * 4;

        const uvX0 = glyphGeom[glyphGeomInd];
        const uxX1 = glyphGeom[glyphGeomInd + 1];
        const uvY0 = glyphGeom[glyphGeomInd + 2];
        const uvY1 = glyphGeom[glyphGeomInd + 3];

        const x0 = charX * glyphWidth + x;
        const x1 = x0 + glyphWidth;
        const y0 = charY * glyphHeight + y;
        const y1 = y0 + glyphHeight;

        v0.pos[0] = x0;
        v0.pos[1] = y0;
        v1.pos[0] = x1;
        v1.pos[1] = y0;
        v2.pos[0] = x0;
        v2.pos[1] = y1;
        v3.pos[0] = x1;
        v3.pos[1] = y1;

        v0.uv[0] = uvX0;
        v0.uv[1] = uvY0;
        v1.uv[0] = uxX1;
        v1.uv[1] = uvY0;
        v2.uv[0] = uvX0;
        v2.uv[1] = uvY1;
        v3.uv[0] = uxX1;
        v3.uv[1] = uvY1;

        // vec4.copy(v0.color, color);
        // vec4.copy(v1.color, color);
        // vec4.copy(v2.color, color);
        // vec4.copy(v3.color, color);

        indices[indicesIndex] = vertexIndex;
        indices[indicesIndex + 1] = vertexIndex + 1;
        indices[indicesIndex + 2] = vertexIndex + 2;
        indices[indicesIndex + 3] = vertexIndex + 1;
        indices[indicesIndex + 4] = vertexIndex + 3;
        indices[indicesIndex + 5] = vertexIndex + 2;

        vertexIndex += 4;
        indicesIndex += 6;
      }
      charX++;
      if (maxCharX !== -1 && charX >= maxCharX) {
        charX = 0;
        charY++;
        // TODO: implement clipping
      }
    }
    batch.reduce(nbMaxIndices - indicesIndex + baseIndiceIndex, nbMaxVertices - vertexIndex + baseVertexIndex);
  }
}
