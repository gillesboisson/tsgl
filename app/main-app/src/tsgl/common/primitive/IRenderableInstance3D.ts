import { mat4 } from 'gl-matrix';
import { AnyWebRenderingGLContext } from '@tsgl/gl';
import { ITransform } from '../transform/ITransform';
import { Transform3D } from '../transform/Transform3D';
import { Camera } from './Camera';
import { IMaterial } from './IMaterial';
import { ISceneInstance } from './ISceneInstance';


export interface IRenderableInstance3D<
  TransformT extends ITransform<mat4> = Transform3D,
  MaterialT extends IMaterial = IMaterial
> extends ISceneInstance<mat4> {
  readonly transform: TransformT;
  render(renderer: AnyWebRenderingGLContext, cam: Camera<any>, material?: MaterialT): void;
}
