import { ASceneInstance } from '../gl/abstract/ASceneInstance';
import { mat4 } from 'gl-matrix';
import { Type } from '../core/Type';
import { ITransform } from '../gl/abstract/ITransform';
import { Transform3D } from '../geom/Transform3D';

export class SceneInstance3D<TransformT extends ITransform<mat4> = Transform3D> extends ASceneInstance<
  mat4,
  TransformT
> {
  constructor(TransformClass: Type<TransformT> = (Transform3D as unknown) as Type<TransformT>) {
    super(mat4, TransformClass);
  }

  updateWorldMat(parentMap: mat4 = null, worldMat?: mat4): mat4 {
    const localMat = this.transform.getLocalMat();

    if (this._parent === null) {
      return mat4.copy(worldMat !== undefined ? worldMat : this._worldMat, localMat);
    } else {
      return mat4.multiply(worldMat !== undefined ? worldMat : this._worldMat, parentMap, localMat);
    }
  }
}
