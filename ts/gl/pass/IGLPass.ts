import { IGLCore } from '../core/IGLCore';
import { GLTexture } from '../texture/GLTexture';
import { mat4 } from 'gl-matrix';
import { AnyWebRenderingGLContext } from '../core/GLHelpers';
import { GLDefaultAttributesLocation } from '../core/data/GLDefaultAttributesLocation';
import { GLCore } from '../core/GLCore';
import { VertexElementBatch } from '../../geom/VertexElementBatch';
import { PositionColor } from '../data/PositionColor';
import { GLBuffer } from '../core/data/GLBuffer';
import { GLVao, AnyWebGLVertexArrayObject, WebGLVaoRenderingContext } from '../core/data/GLVao';
import { GLShader } from '../core/shader/GLShader';
import { WireframeShader } from '../../tsgl/shaders/WireframeShader';
import { getUniformsLocation } from '../core/shader/getUniformsLocation';
import { GLRenderer } from '../core/GLRenderer';
import { IShaderProgram } from '../core/shader/IShaderProgram';
// import { PositionColor } from '../../index';

export interface IPrepare<PrepareF extends Function = () => void> {
  prepare: PrepareF;
}

export interface IBind<BindF extends Function = () => void> {
  bind: BindF;
}

export interface ISync<SyncF extends Function = () => void> {
  sync: SyncF;
}

export interface IApply<ApplyF extends Function = () => void> {
  apply: ApplyF;
}

export interface IGLPass<PrepareF extends Function = () => void, ApplyF extends Function = () => void>
  extends IGLCore,
    IPrepare<PrepareF>,
    IApply<ApplyF> {}

interface GLBaseMeshData {
  nbElements: number;
  vao: WebGLVertexArrayObject | WebGLVertexArrayObjectOES;
}

export interface IBasicTextureModelPass
  extends IGLPass<() => void, (mesh: GLBaseMeshData, texture: GLTexture, mvp: mat4) => void>,
    IBind<(program: WebGLProgram) => void> {}

export class BasicTextureModelPass implements IBasicTextureModelPass {
  protected _gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext) {
    this._gl = gl as WebGL2RenderingContext;
  }

  getGL(): WebGL2RenderingContext {
    return this._gl;
  }

  prepare(): void {}

  bind(program: WebGLProgram) {
    this._gl.useProgram(program);
  }

  apply(mesh: GLBaseMeshData, texture: GLTexture, mvp: mat4) {
    const gl = this._gl;
    gl.bindVertexArray(mesh.vao);
    gl.uniformMatrix4fv(GLDefaultAttributesLocation.POSITION, false, mvp);
    gl.drawElements(gl.TRIANGLES, mesh.nbElements, gl.UNSIGNED_SHORT, 0);
  }

  destroy(): void {}
}

export interface RenderPassDictionnary {
  [name: string]: IGLPass;
}
