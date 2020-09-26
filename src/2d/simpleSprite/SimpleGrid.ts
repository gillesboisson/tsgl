import { vec2, vec4 } from 'gl-matrix';
import { SubTexture } from '../SubTexture';
import { SimpleElement } from './SimpleElement';
import { Camera2D } from '../Camera2D';
import { SimpleWorldCoords } from './SimpleWorldCoords';
import { SimpleSpriteBatch, SimpleSpriteBatchPullable, SimpleSpriteBatchData } from './SimpleSpriteBatch';

export type GridIndexMapper = (
  ind: number,
  x: number,
  y: number,
  data: number[],
  gridWidth: number,
  gridHeight: number,
) => number;

export type KernelCompare = (
  base: number,
  val: number,
  kernel: number,
  kernelX: number,
  kernelY: number,
  kernelSize: number,
) => number;

export const KernelCompareFuncs = {
  base: function (
    base: number,
    val: number,
    kernel: number,
    kernelX: number,
    kernelY: number,
    kernelSize: number,
  ): number {
    return base + val * kernel;
  },
};

export function createEmptyDataSet(width: number, height: number): number[] {
  const length = width * height;
  const data = new Array(length);
  for (let index = 0; index < length; index++) {
    data[index] = 0;
  }
  return data;
}

export function createConvolutionGridIndexMapper(
  kernel: number[],
  kernelWidth: number,
  kernelHeight: number,
  compare: KernelCompare = KernelCompareFuncs.base,
): GridIndexMapper {
  if (kernel.length !== kernelWidth * kernelHeight) throw new Error("Kernel data doesn' match provides dimensions");
  const kernelLength = kernel.length;
  return function (ind: number, x: number, y: number, data: number[], gridWidth: number, gridHeight: number): number {
    let base = 0;
    const xOffset = (kernelWidth - 1) / 2;
    const YOffset = (kernelHeight - 1) / 2;
    for (let i = 0; i < kernelLength; i++) {
      const kernelX = i % kernelWidth;
      const kernelY = Math.floor(i / kernelWidth);
      const gridX = kernelX + x - xOffset;
      const gridY = kernelY + y - YOffset;
      if (gridX < 0 || gridY < 0 || gridX >= gridWidth || gridY >= gridHeight) continue;
      const ind = gridX + gridY * gridWidth;
      base = compare(base, data[ind], kernel[i], kernelX, kernelY, kernelLength);
    }

    return base;
  };
}

export class SimpleGrid extends SimpleElement implements SimpleSpriteBatchPullable {
  protected _grid: number[];
  protected _nbElementX: number;
  protected _nbElementY: number;
  protected _tileWidth: number;
  protected _tileHeight: number;
  protected _width: number;
  protected _height: number;
  protected _cam: Camera2D;
  protected _textures: SubTexture[];
  protected _indMappers: GridIndexMapper[];

  constructor(
    textures: SubTexture[],
    grid: number[],
    nbElementX: number,
    nbElementY: number,
    tileWidth: number,
    tileHeight: number,
    cam: Camera2D,
  ) {
    if (textures.length === 0) throw new Error('Empty subtexture collection');
    if (grid.length !== nbElementX * nbElementY) throw new Error("Grid size doesn't have nb elements");

    super(textures[0].glTexture);
    this._grid = grid;
    this._nbElementX = nbElementX;
    this._nbElementY = nbElementY;
    this._tileWidth = tileWidth;
    this._tileHeight = tileHeight;
    this._cam = cam;
    this._textures = textures;

    this._width = this._tileWidth * this._nbElementX;
    this._height = this._tileHeight * this._nbElementY;
    this._indMappers = [];
  }

  addIndexMapper(mapper: GridIndexMapper) {
    this._indMappers.push(mapper);
  }

  removeIndexMapper(mapper: GridIndexMapper) {
    const ind = this._indMappers.indexOf(mapper);
    if (ind !== -1) {
      this._indMappers.splice(ind, 1);
    }
  }

  /**
   * Return grid value at grid based coordinated
   * @param x
   * @param y
   */
  getGridIndexAt(x: number, y: number) {
    return this._grid[x + y * this._nbElementX];
  }

  get grid(): number[] {
    return this._grid;
  }

  get nbElementX(): number {
    return this._nbElementX;
  }
  get nbElementY(): number {
    return this._nbElementY;
  }

  setDataAt(x: number, y: number, val: number) {
    this._grid[x + y * this._nbElementX] = val;
  }

  getDataAt(x: number, y: number): number {
    return this._grid[x + y * this._nbElementX];
  }

  draw(batch: SimpleSpriteBatch, parentWorldCoords?: SimpleWorldCoords): void {
    this.calcWorldCoordinate(parentWorldCoords);
    const gridWidth = Math.ceil(this._cam.viewportWidth / this._tileWidth);
    const gridHeight = Math.ceil(this._cam.viewportHeight / this._tileHeight);

    const nbElement = gridWidth * gridHeight;

    const nbVertices = nbElement * 4;
    const nbIndices = nbElement * 6;
    batch.push(nbIndices, nbVertices, this._texture, this);
  }
  pull(
    batch: SimpleSpriteBatch,
    vertices: SimpleSpriteBatchData[],
    indices: Uint16Array,
    vertexIndex: number,
    indicesIndex: number,
  ): void {
    const gridWidth = Math.ceil(this._cam.viewportWidth / this._tileWidth);
    const gridHeight = Math.ceil(this._cam.viewportHeight / this._tileHeight);
    const maxElements = gridWidth * gridHeight;
    let nbElements = 0;

    const camPos = this._cam.transform.getRawPosition();

    const x = this._worldCoords.x;
    const y = this._worldCoords.y;
    const nbElementX = this._nbElementX;
    const nbElementY = this._nbElementY;
    const grid = this._grid;
    const textures = this._textures;
    // const color = this._worldCoords.color;
    const tileWidth = this._tileWidth;
    const tileHeight = this._tileHeight;

    let gridX0 = Math.floor((camPos[0] - x) / tileWidth);
    let gridY0 = Math.floor((camPos[1] - y) / tileHeight);
    let gridX1 = Math.ceil((camPos[0] - x + this._cam.viewportWidth) / tileWidth);
    let gridY1 = Math.ceil((camPos[1] - y + this._cam.viewportHeight) / tileHeight);
    let textureInd;

    const indMappers = this._indMappers;

    // cap to element size
    if (gridX0 < 0) gridX0 = 0;
    if (gridY0 < 0) gridY0 = 0;
    if (gridX1 > nbElementX) gridX1 = nbElementX;
    if (gridY1 > nbElementY) gridY1 = nbElementY;

    for (let iY = gridY0; iY < gridY1; iY++) {
      for (let iX = gridX0; iX < gridX1; iX++) {
        const ind = iX + iY * nbElementX;
        textureInd = grid[ind];

        for (let mapInd = 0; mapInd < indMappers.length; mapInd++) {
          textureInd = indMappers[mapInd](textureInd, iX, iY, grid, nbElementX, nbElementY);
        }

        if (textureInd !== 0) {
          const tileLeft = iX * tileWidth + x;
          const tileTop = iY * tileHeight + y;
          const tileRight = tileLeft + tileWidth;
          const tileBottom = tileTop + tileHeight;

          // 0 = no texture 1 = texture 0
          const tileTexture = textures[textureInd - 1];

          const uvs = tileTexture.uv;

          const v0 = vertices[vertexIndex];
          const v1 = vertices[vertexIndex + 1];
          const v2 = vertices[vertexIndex + 2];
          const v3 = vertices[vertexIndex + 3];

          vec2.set(v0.pos, tileLeft, tileTop);
          vec2.set(v1.pos, tileRight, tileTop);
          vec2.set(v2.pos, tileLeft, tileBottom);
          vec2.set(v3.pos, tileRight, tileBottom);

          vec2.set(v0.uv, uvs[0], uvs[1]);
          vec2.set(v1.uv, uvs[2], uvs[1]);
          vec2.set(v2.uv, uvs[0], uvs[3]);
          vec2.set(v3.uv, uvs[2], uvs[3]);

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
          nbElements++;
        }
      }
    }

    const nbReducedElement = maxElements - nbElements;
    batch.reduce(nbReducedElement * 6, nbReducedElement * 4);
  }
}
