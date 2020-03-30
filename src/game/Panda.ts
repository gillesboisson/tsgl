import { SimpleSprite } from '../2d/SimpleSprite';
import { SimpleGrid } from '../2d/SimpleGrid';
import { SubTexture } from '../2d/SubTexture';
import GameInputStateManager from './GameInputStateManager';

export class Panda extends SimpleSprite {
  protected _wallAround: boolean[] = new Array(9);
  constructor(
    protected textures: { left: SubTexture; right: SubTexture; up: SubTexture; down: SubTexture },
    protected inputHandler: GameInputStateManager,
  ) {
    super(textures.down);

    console.log('textures : ', textures);
  }

  static isWall(map: SimpleGrid, activeMap: SimpleGrid, gridPosX: number, gridPosY: number): boolean {
    return map.getGridIndexAt(gridPosX, gridPosY) > 16 || activeMap.getGridIndexAt(gridPosX, gridPosY) > 16;
  }

  updateWallAround(map: SimpleGrid, activeMap: SimpleGrid, gridPosX: number, gridPosY: number) {
    for (let i = 0; i < 9; i++) {
      // console.log((i % 3) + gridPosX, Math.floor(i / 3) + gridPosY);
      this._wallAround[i] = Panda.isWall(map, activeMap, (i % 3) + gridPosX - 1, Math.floor(i / 3) + gridPosY - 1);
    }

    // console.log(
    //   '--\n',
    //   this._wallAround.slice(0, 3),
    //   '\n',
    //   this._wallAround.slice(3, 6),
    //   '\n',
    //   this._wallAround.slice(6, 9),
    // );
  }

  protected move(xOffset: number, yOffset: number) {
    switch (true) {
      case xOffset == 1:
        this.subTexture = this.textures.right;
        break;
      case xOffset == -1:
        this.subTexture = this.textures.left;
        break;
      case yOffset == 1:
        this.subTexture = this.textures.down;
        break;
      case yOffset == -1:
        this.subTexture = this.textures.up;
        break;
      default:
        break;
    }

    this.x += xOffset;
    this.y += yOffset;
  }

  update(bgmap: SimpleGrid, activemap: SimpleGrid) {
    const gridPosX = this.x / 16;
    const gridPosY = this.y / 16 + 1;

    const roundGridPosX = Math.round(gridPosX);
    const roundGridPosY = Math.round(gridPosY);

    const coordRoundOffsetX = roundGridPosX === gridPosX ? 0 : roundGridPosX > gridPosX ? -1 : 1;
    const coordRoundOffsetY = roundGridPosY === gridPosY ? 0 : roundGridPosY > gridPosY ? -1 : 1;

    // console.log(
    //   Math.round(gridPosX),
    //   Math.round(gridPosY),
    //   Panda.isWall(map, Math.round(gridPosX), Math.round(gridPosY)),
    // );
    let moved = false;

    if (this.inputHandler.state.d_pad_left) {
      this.updateWallAround(bgmap, activemap, Math.ceil(gridPosX), roundGridPosY);
      if (!this._wallAround[3]) {
        moved = true;
        if (!this._wallAround[3 + coordRoundOffsetY * 3]) {
          this.move(-1, 0);
        } else {
          this.move(0, -coordRoundOffsetY);
        }
      }
    }

    if (this.inputHandler.state.d_pad_right && !moved) {
      this.updateWallAround(bgmap, activemap, Math.floor(gridPosX), roundGridPosY);
      if (!this._wallAround[5]) {
        moved = true;

        if (!this._wallAround[5 + coordRoundOffsetY * 3]) {
          this.move(1, 0);
        } else {
          this.move(0, -coordRoundOffsetY);
        }
      }
    }

    if (this.inputHandler.state.d_pad_up && !moved) {
      this.updateWallAround(bgmap, activemap, roundGridPosX, Math.ceil(gridPosY));
      if (!this._wallAround[1]) {
        moved = true;

        if (!this._wallAround[1 + coordRoundOffsetX]) {
          this.move(0, -1);
        } else {
          this.move(-coordRoundOffsetX, 0);
        }
      }
    }

    if (this.inputHandler.state.d_pad_down && !moved) {
      this.updateWallAround(bgmap, activemap, roundGridPosX, Math.floor(gridPosY));
      if (!this._wallAround[7]) {
        if (!this._wallAround[7 + coordRoundOffsetX]) {
          this.move(0, 1);
        } else {
          this.move(-coordRoundOffsetX, 0);
        }
      }
    }
  }
}
