import { mat4 } from 'gl-matrix';
import { Transform3D } from '../utils';
import { ITransform } from '../utils';
import { AnyWebRenderingGLContext } from '../gl/';
import { Camera } from './Camera';
import { IMaterial } from './Material/IMaterial';
import { ISceneInstance } from '../utils';

export interface IRenderableInstance3D<
  TransformT extends ITransform<mat4> = Transform3D,
  MaterialT extends IMaterial = IMaterial
> extends ISceneInstance<mat4> {
  readonly transform: TransformT;
  // readonly material: MaterialT;

  // updateWorldMat(parentMap?: mat4, worldMat?: mat4): mat4;

  render(renderer: AnyWebRenderingGLContext, cam: Camera<any>, material?: MaterialT): void;
}
