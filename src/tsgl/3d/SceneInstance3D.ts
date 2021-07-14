import { ASceneInstance } from '../gl/abstract/ASceneInstance';
import { mat4 } from 'gl-matrix';
import { Type } from '../base/Type';
import { ITransform } from '../gl/abstract/ITransform';
import { Transform3D } from '../geom/Transform3D';
import { IMaterial } from './Material/IMaterial';
import { GLMesh } from '../gl/core/data/GLMesh';
import { IRenderableInstance3D } from './IRenderableInstance3D';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { Camera } from './Camera';

export class SceneInstance3D<TransformT extends ITransform<mat4> = Transform3D, ChilddrenT extends ASceneInstance<mat4, ITransform<mat4>> = any> extends ASceneInstance<
  mat4,
  TransformT,
  ChilddrenT
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



export class MeshNode<MaterialT extends IMaterial = IMaterial> extends SceneInstance3D<Transform3D> implements IRenderableInstance3D {
  constructor(public material: MaterialT, public mesh: GLMesh) {
    super(Transform3D);
  }

  render(gl: AnyWebRenderingGLContext, cam: Camera<any>, material: MaterialT = this.material): void {
    // const material = this.material;

    material.prepare(gl, cam, this._worldMat);
    this.mesh.draw();
    material.unbind(gl);
  }
}
