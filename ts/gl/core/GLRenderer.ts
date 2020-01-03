import { vec4 } from 'gl-matrix';
import { AnyWebRenderingGLContext } from './GLHelpers';
import { GLCore } from './GLCore';
import { IShaderProgram } from './shader/IShaderProgram';
import { ShadersDictionnary } from './shader/GLShader';
import { IShaderFactoryType } from './shader/IGLShader';

export enum GLRendererType {
  WebGL,
  WebGL2,
}

export class GLRenderer extends GLCore {
  static createFromCanvas<RenderT extends GLRenderer = GLRenderer>(
    canvas: HTMLCanvasElement,
    type: GLRendererType = GLRendererType.WebGL,
    rendererClass: any = GLRenderer,
  ): RenderT {
    const gl = canvas.getContext(type === GLRendererType.WebGL ? 'webgl' : 'webgl2');
    return new rendererClass(gl, type, canvas) as RenderT;
  }

  static create(
    width: number,
    height: number,
    type: GLRendererType = GLRendererType.WebGL,
    rendererClass: any = GLRenderer,
  ): GLRenderer {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return this.createFromCanvas(canvas, type, rendererClass);
  }

  private _width: number;
  private _height: number;
  private _clearColor: vec4;

  protected _shaders: ShadersDictionnary = {};

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get shaders(): ShadersDictionnary {
    return this._shaders;
  }

  constructor(gl: AnyWebRenderingGLContext, public type: GLRendererType, public canvas: HTMLCanvasElement) {
    super(gl);
    this._width = canvas.width;
    this._height = canvas.height;

    this._clearColor = vec4.fromValues(0, 0, 0, 1);
    this.gl.clearColor(this._clearColor[0], this._clearColor[1], this._clearColor[2], this._clearColor[3]);

    this.setup();
  }

  set clearColor(clearColor: vec4) {
    vec4.copy(this._clearColor, clearColor);
    this.gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
  }

  getShader(shaderName: string): IShaderProgram {
    const shaderProp = this._shaders[shaderName];
    if (shaderProp === undefined) throw new Error('Shader not found ' + shaderName);

    if (shaderProp.shader !== undefined) return shaderProp.shader;
    if (shaderProp.shaderCreate) {
      const shader = shaderProp.shaderCreate(this);
      if (!shader) throw new Error('Failed to create shader for ' + shaderName);
      return shader;
    } else throw new Error('Shader prop for ' + shaderName + ' is empty');
  }

  registerShaderFromClass(ShaderF: IShaderFactoryType) {
    ShaderF.registerShader(this);
  }

  registerShader(shaderName: string, shader: IShaderProgram) {
    if (this._shaders[shaderName]) throw new Error('Shader ' + shaderName + ' already exists');

    this._shaders[shaderName] = { shader };
  }

  registerShaderIfRequired(shaderName: string, shaderCreate: () => IShaderProgram) {
    if (this._shaders[shaderName]) throw new Error('Shader ' + shaderName + ' already exists');

    this._shaders[shaderName] = { shaderCreate };
  }

  setup() {
    const gl = this.gl;
    gl.enable(gl.CULL_FACE); // Active le test de profondeur
    gl.enable(gl.DEPTH_TEST); // Active le test de profondeur
    gl.depthFunc(gl.LESS); // Les objets proches cachent les objets lointains

    gl.enable(gl.BLEND);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // premultiply alpha
  }

  clear(clearFlags: number = this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT) {
    this.gl.clear(clearFlags);
  }

  destroy(): void {}
}
