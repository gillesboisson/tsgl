import { mat4 } from 'gl-matrix';
import { Type } from '../../core/Type';
import { ISceneInstance } from './ISceneInstance';
import { ITransform } from './ITransform';
import { MatType } from './MatType';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IDENT_MAT4 = mat4.create();

export abstract class ASceneInstance<MatT, TransformT extends ITransform<MatT>> implements ISceneInstance<MatT> {
  transform: TransformT;
  protected _worldMat: MatT;
  protected _nodes: ASceneInstance<MatT, ITransform<MatT>>[] = [];
  protected _parent: ASceneInstance<MatT, ITransform<MatT>> = null;

  getNodes<T extends ISceneInstance<MatT> = ASceneInstance<MatT, ITransform<MatT>>>():  T[]{
    return this._nodes as any;
  }

  constructor(MatClass?: MatType<MatT>, TransformClass?: Type<TransformT>) {
    this._worldMat = MatClass.create();
    this.transform = new TransformClass();
  }

  addChild(node: ASceneInstance<MatT, ITransform<MatT>>): void {
    if (this._nodes.indexOf(node) === -1) {
      this._nodes.push(node);
      node._parent = this;
    }
  }

  removeChild(node: ASceneInstance<MatT, ITransform<MatT>>): void {
    const ind = this._nodes.indexOf(node);
    if (ind !== -1) {
      this._nodes.splice(ind, 1);
      node._parent = null;
    }
  }

  calcWorldMat(worldMat?: MatT): MatT {
    return this.updateWorldMat(this._parent !== null ? this._parent.calcWorldMat() : null, worldMat);
  }

  getCachedWorldMat(): MatT {
    return this._worldMat;
  }

  updateTransform(parentMat?: MatT): void {
    this.updateWorldMat(parentMat, this._worldMat);
    for (const child of this._nodes) {
      child.updateTransform(this._worldMat);
    }
  }

  protected abstract updateWorldMat(parentMap?: MatT, worldMat?: MatT): MatT;
}
