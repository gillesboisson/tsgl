import { mat4 } from 'gl-matrix';
import { Type } from '../../core/Type';
import { ITransform } from './ITransform';
import { MatType } from './MatType';

const IDENT_MAT4 = mat4.create();

export abstract class ASceneInstance<MatT, TransformT extends ITransform<MatT>> {
  transform: TransformT;
  protected _worldMat: MatT;
  protected _nodes: ASceneInstance<MatT, ITransform<MatT>>[] = [];
  protected _parent: ASceneInstance<MatT, ITransform<MatT>> = null;

  constructor(MatClass?: MatType<MatT>, TransformClass?: Type<TransformT>) {
    this._worldMat = MatClass.create();
    this.transform = new TransformClass();
  }

  addChild(node: ASceneInstance<MatT, ITransform<MatT>>) {
    if (this._nodes.indexOf(node) === -1) {
      this._nodes.push(node);
      node._parent = this;
    }
  }

  removeChild(node: ASceneInstance<MatT, ITransform<MatT>>) {
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

  resolveTransformTree(parentMat?: MatT): void {
    this.updateWorldMat(parentMat, this._worldMat);
    for (let child of this._nodes) {
      child.resolveTransformTree(this._worldMat);
    }
  }

  protected abstract updateWorldMat(parentMap?: MatT, worldMat?: MatT): MatT;

  // getWorldMat(worldMat: MatT = this._worldMat): MatT {
  //     const localMat = this._transform.getLocalMat();
  //
  //     if (this._parent === null) {
  //         return localMat;
  //     } else {
  //         return this.MatClass.multiply(worldMat, this._parent.getWorldMat(), localMat);
  //     }
  // }
}
