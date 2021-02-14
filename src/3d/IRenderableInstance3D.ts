import { mat4 } from 'gl-matrix';
import { Transform3D } from '../geom/Transform3D';
import { ISceneInstance } from '../gl/abstract/ISceneInstance';
import { ITransform } from '../gl/abstract/ITransform';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { Camera } from './Camera';
import { IMaterial } from './Material/IMaterial';

export interface IRenderableInstance3D<TransformT extends ITransform<mat4> = Transform3D> extends ISceneInstance<mat4> {
  readonly transform: TransformT;
  readonly material: IMaterial;

  // updateWorldMat(parentMap?: mat4, worldMat?: mat4): mat4;

  render(renderer: AnyWebRenderingGLContext, cam: Camera): void;
}
