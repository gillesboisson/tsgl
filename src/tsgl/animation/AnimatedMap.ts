import { IAnimated } from './IAnimated';
import { GridIndexMapper } from '../2d/simpleSprite/SimpleGrid';
import { AnimatedMapData } from './AnimatedMapData';

export class AnimatedMap implements IAnimated {
  protected _frames: number[] = [];
  protected _datas: AnimatedMapData[] = [];

  protected _indexMapper = (sourceInd: number): number => {
    const datas = this._datas;
    for (let i = 0; i < datas.length; i++) {
      const data = datas[i];

      if (data.firstFrame === sourceInd) {
        return this._frames[i];
      }
    }
    return sourceInd;
  };

  addAnimation(nbFrame: number, firstFrame: number, fps: number): AnimatedMapData {
    const data: AnimatedMapData = { nbFrame, firstFrame, fps };
    this.addAnimationData(data);
    return data;
  }

  protected addAnimationData(data: AnimatedMapData): void {
    this._datas.push(data);
    this._frames.push(data.firstFrame);
  }

  addAnimationDatas(...datas: AnimatedMapData[]): void {
    for (const data of datas) {
      this.addAnimationData(data);
    }
  }

  removeAnimationData(data: AnimatedMapData): void {
    const ind = this._datas.indexOf(data);
    if (ind !== -1) this._datas.splice(ind, 1);
  }

  get indexMapper(): GridIndexMapper {
    return this._indexMapper;
  }

  // IAnimated implementation

  animationStart(): void {
    this.animationUpdate(0, 0);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  animationEnd(time: number): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  animationUpdate(time: number, elapsedTime: number): void {
    const frames = this._frames;

    for (let i = 0; i < this._datas.length; i++) {
      const { nbFrame, firstFrame, fps } = this._datas[i];

      frames[i] = (Math.floor((time / 1000) * fps) % nbFrame) + firstFrame;
    }
  }
}
