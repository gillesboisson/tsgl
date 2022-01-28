import { mat4 } from 'gl-matrix';
import { GLVao } from '../../gl';
import { AnyWebRenderingGLContext } from '../../gl';
import { IGLShaderState } from '../../gl';
import { Camera, IMaterial } from '../../common';

export abstract class AMaterial<ShaderStateT extends IGLShaderState = IGLShaderState>
implements IMaterial<ShaderStateT> {
  protected _shaderState: ShaderStateT;

  get shaderState(): ShaderStateT {
    return this._shaderState;
  }

  abstract prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  drawVao(
    gl: AnyWebRenderingGLContext,
    vao: GLVao,
    count: number,
    drawType?: GLenum,
    drawMode: GLenum = gl.TRIANGLES,
  ): void {
    vao.bind();
    if (drawType !== undefined) {
      gl.drawElements(drawMode, count, drawType, 0);
    } else {
      gl.drawArrays(drawMode, 0, count);
    }
    vao.unbind();
  }

  abstract unbind(gl: AnyWebRenderingGLContext): void;

  renderVao(
    gl: AnyWebRenderingGLContext,
    cam: Camera,
    transformMat: mat4,
    vao: GLVao,
    count: number,
    drawType?: number,
    drawMode?: number,
  ): void {
    this.prepare(gl, cam, transformMat);
    this.drawVao(gl, vao, count, drawType, drawMode);
    this.unbind(gl);
  }
}
