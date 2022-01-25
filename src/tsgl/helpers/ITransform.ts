export interface ITransform<MatT> {
  setDirty(): void;
  getLocalMat(): MatT;
}
