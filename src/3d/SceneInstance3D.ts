import { ASceneInstance } from '../gl/abstract/ASceneInstance';
import { mat4 } from 'gl-matrix';
import { Type } from '../core/Type';
import { ITransform } from '../gl/abstract/ITransform';
import { Transform3D } from '../geom/Transform3D';
import { IMaterial } from './Material/IMaterial';
import { GLMesh } from '../gl/core/data/GLMesh';
import { IRenderableInstance3D } from './IRenderableInstance3D';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { Camera } from './Camera';

export class SceneInstance3D<TransformT extends ITransform<mat4> = Transform3D> extends ASceneInstance<
  mat4,
  TransformT
> {
  constructor(TransformClass: Type<TransformT> = (Transform3D as unknown) as Type<TransformT>) {
    super(mat4, TransformClass);
  }

  protected updateWorldMat(parentMap: mat4 = null, worldMat?: mat4): mat4 {
    const localMat = this.transform.getLocalMat();

    if (this._parent === null) {
      return mat4.copy(worldMat !== undefined ? worldMat : this._worldMat, localMat);
    } else {
      return mat4.multiply(worldMat !== undefined ? worldMat : this._worldMat, parentMap, localMat);
    }
  }
}

export class MeshNode extends SceneInstance3D<Transform3D> implements IRenderableInstance3D {
  constructor(public material: IMaterial, public mesh: GLMesh) {
    super(Transform3D);
  }

  render(gl: AnyWebRenderingGLContext, cam: Camera): void {
    const material = this.material;

    material.prepare(gl, cam, this._worldMat);
    this.mesh.draw();
    material.unbind(gl);
  }
}
