import { GLShader } from './shader/GLShader';
import { IGLFrameBuffer } from './framebuffer/IGLFrameBuffer';
import { GLCore } from './GLCore';
import { AnyWebRenderingGLContext } from './GLHelpers';
import { GLMesh } from './data/GLMesh';
import { GLShaderState } from './shader/GLShaderState';

export class APostRenderingPass<
  ShaderStateT extends GLShaderState,
  ShaderT extends GLShader<ShaderStateT>
> extends GLCore {
  protected _quad: GLMesh;
  protected _shaderState: ShaderStateT;

  get shaderState() {
    return this._shaderState;
  }

  constructor(gl: AnyWebRenderingGLContext, protected _shader: ShaderT) {
    super(gl);
    this._shaderState = _shader.createState();
  }

  render() {
    this._shaderState.use();
    this._shaderState.syncUniforms();
    this._quad.draw();
  }

  destroy(): void {
    this._quad.destroy();
  }
}
