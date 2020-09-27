import { SimpleElement } from './SimpleSpriteElement';
import { Camera2D } from '../Camera2D';
import { SimpleWorldCoords } from './SimpleElementData';
import { SimpleTextFont } from './SimpleText';
import { SpriteBatchPullable, SpriteBatch, SpriteBatchData } from '../SpriteBatch';

export type GridIndexMapper = (
  ind: number,
  x: number,
  y: number,
  data: number[],
  gridWidth: number,
  gridHeight: number,
) => number;

export class SimpleGridDebugger extends SimpleElement implements SpriteBatchPullable {
  protected _grid: number[];
  protected _nbElementX: number;
  protected _nbElementY: number;
  protected _tileWidth: number;
  protected _tileHeight: number;
  protected _width: number;
  protected _height: number;
  protected _cam: Camera2D;
  protected _font: SimpleTextFont;
  protected _indMappers: GridIndexMapper[];

  constructor(
    font: SimpleTextFont,
    grid: number[],
    nbElementX: number,
    nbElementY: number,
    tileWidth: number,
    tileHeight: number,
    cam: Camera2D,
  ) {
    if (grid.length !== nbElementX * nbElementY) throw new Error("Grid size doesn't have nb elements");

    super(font.texture.glTexture);
    this._grid = grid;
    this._nbElementX = nbElementX;
    this._nbElementY = nbElementY;
    this._tileWidth = tileWidth;
    this._tileHeight = tileHeight;
    this._cam = cam;
    this._font = font;

    this._width = this._tileWidth * this._nbElementX;
    this._height = this._tileHeight * this._nbElementY;
    this._indMappers = [];
  }

  addIndexMapper(mapper: GridIndexMapper): void {
    this._indMappers.push(mapper);
  }

  removeIndexMapper(mapper: GridIndexMapper): void {
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
  getGridIndexAt(x: number, y: number): number {
    return this._grid[x + y * this._nbElementX];
  }

  setDataAt(x: number, y: number, val: number): void {
    this._grid[x + y * this._nbElementX] = val;
  }

  draw(batch: SpriteBatch, parentWorldCoords?: SimpleWorldCoords): void {
    this.calcWorldCoordinate(parentWorldCoords);
    const gridWidth = Math.ceil(this._cam.viewportWidth / this._tileWidth);
    const gridHeight = Math.ceil(this._cam.viewportHeight / this._tileHeight);

    const nbElement = gridWidth * gridHeight * 2;

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
    const maxElements = gridWidth * gridHeight * 2;
    let nbElements = 0;

    const camPos = this._cam.transform.getRawPosition();

    const x = this._worldCoords.x;
    const y = this._worldCoords.y;
    const nbElementX = this._nbElementX;
    const nbElementY = this._nbElementY;
    const grid = this._grid;
    // const color = this._worldCoords.color;
    const tileWidth = this._tileWidth;
    const tileHeight = this._tileHeight;

    const font = this._font;
    const glyphWidth = font.glyphWidth;
    const glyphHeight = font.glyphHeight;
    const glyphGeom = font.glyphGeom;
    const glyphs = font.glyphs;

    let gridX0 = Math.floor((camPos[0] - x) / tileWidth);
    let gridY0 = Math.floor((camPos[1] - y) / tileHeight);
    let gridX1 = Math.ceil((camPos[0] - x + this._cam.viewportWidth) / tileWidth);
    let gridY1 = Math.ceil((camPos[1] - y + this._cam.viewportHeight) / tileHeight);
    let textureInd;

    const indMappers = this._indMappers;

    const yOffset = (tileHeight - glyphHeight) / 2;

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

        const indStr = textureInd.toString();
        const size = indStr.length * glyphWidth;
        const x = (tileWidth - size) / 2 + iX * tileWidth;
        const y = yOffset + iY * tileHeight;

        // if (indStr !== '0') debugger;
        // console.log(indStr, x, y);

        for (let glyphI = 0; glyphI < indStr.length; glyphI++) {
          const v0 = vertices[vertexIndex];
          const v1 = vertices[vertexIndex + 1];
          const v2 = vertices[vertexIndex + 2];
          const v3 = vertices[vertexIndex + 3];

          const char = indStr.substr(glyphI, 1);
          // console.log('char : ', char);
          const glyphGeomInd = glyphs.indexOf(char) * 4;
          const uvX0 = glyphGeom[glyphGeomInd];
          const uxX1 = glyphGeom[glyphGeomInd + 1];
          const uvY0 = glyphGeom[glyphGeomInd + 2];
          const uvY1 = glyphGeom[glyphGeomInd + 3];

          const x0 = glyphI * glyphWidth + x;
          const x1 = x0 + glyphWidth;
          const y0 = y;
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
          nbElements++;
        }
      }
    }
    // debugger;
    const nbReducedElement = maxElements - nbElements;
    batch.reduce(nbReducedElement * 6, nbReducedElement * 4);
  }
}
