import { SpriteBatchPullable, SpriteBatchRenderable, SpriteBatch, SpriteBatchData } from './SpriteBatch';
import { vec2, vec4 } from 'gl-matrix';
import { SubTexture } from './SubTexture';
import { SimpleElement } from './SimpleElement';
import { Camera } from '../3d/Camera';
import { Camera2D } from './Camera2D';
import { SimpleGroup } from './SimpleGroup';
import { SimpleWorldCoords } from './SimpleWorldCoords';

export type GridIndexMapper = (
  ind: number,
  x: number,
  y: number,
  data: number[],
  gridWidth: number,
  gridHeight: number,
) => number;

export class SimpleGrid extends SimpleElement implements SpriteBatchPullable {
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

  draw(batch: SpriteBatch, parentWorldCoords?: SimpleWorldCoords): void {
    this.calcWorldCoordinate(parentWorldCoords);
    const gridWidth = Math.ceil(this._cam.viewportWidth / this._tileWidth);
    const gridHeight = Math.ceil(this._cam.viewportHeight / this._tileHeight);

    const nbElement = gridWidth * gridHeight;

    const nbVertices = nbElement * 4;
    const nbIndices = nbElement * 6;
    batch.push(nbIndices, nbVertices, this._texture, this);
  }
  pull(
    batch: SpriteBatch,
    vertices: SpriteBatchData[],
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
    const color = this._worldCoords.color;
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

          vec4.copy(v0.color, color);
          vec4.copy(v1.color, color);
          vec4.copy(v2.color, color);
          vec4.copy(v3.color, color);

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
