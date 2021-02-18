
export interface ISceneInstance<MatT> {
  calcWorldMat(worldMat?: MatT): MatT;
  getCachedWorldMat(): MatT;
  updateTransform(parentMat?: MatT): void;
}
