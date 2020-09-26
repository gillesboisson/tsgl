import { vec4 } from 'gl-matrix';
import { AnyWebRenderingGLContext } from './GLHelpers';
import { GLCore } from './GLCore';
import { GLShader, IShaderRegisterer } from './shader/GLShader';
import { IGLShaderState } from './shader/IGLShaderState';
import { GLViewportState, GLViewportStack } from './framebuffer/GLViewportState';

export enum GLRendererType {
  WebGL,
  WebGL2,
}

export class GLRenderer extends GLCore {
  protected _shaders: { [key: string]: GLShader<IGLShaderState> } = {};
  protected _shadersFactories: {
    [key: string]: (gl: AnyWebRenderingGLContext, name: string) => GLShader<IGLShaderState>;
  } = {};
  protected _viewportStack: GLViewportStack;

  get viewportStack(): GLViewportStack {
    return this._viewportStack;
  }

  public registerShaderFactory(factory: IShaderRegisterer): void {
    factory.register(this);
  }

  public registerShaderFactoryFunction(
    name: string,
    shaderFactory: (gl: AnyWebRenderingGLContext, name: string) => GLShader<IGLShaderState>,
  ): void {
    if (this._shadersFactories[name] === undefined) this._shadersFactories[name] = shaderFactory;
  }

  public registerShader(name: string, shader: GLShader<IGLShaderState>): void {
    if (this._shaders[name] === undefined) this._shaders[name] = shader;
  }

  public getShader<ShaderStateT extends IGLShaderState>(name: string): GLShader<ShaderStateT> {
    let shader: GLShader<ShaderStateT> = null;
    if (this._shaders[name] === undefined) {
      if (this._shadersFactories[name] === undefined) throw new Error(`Shader ${name} not found`);

      this._shaders[name] = shader = this._shadersFactories[name](this.gl, name) as GLShader<ShaderStateT>;
    } else {
      shader = this._shaders[name] as GLShader<ShaderStateT>;
    }

    return shader;
  }

  public createShaderState<ShaderStateT extends IGLShaderState>(name: string): ShaderStateT {
    const shader: GLShader<ShaderStateT> = this.getShader(name);
    return shader.createState();
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  static createFromCanvas(
    canvas: HTMLCanvasElement,
    type: GLRendererType = GLRendererType.WebGL,
    rendererClass: any = GLRenderer,
  ): GLRenderer {
    const gl = canvas.getContext(type === GLRendererType.WebGL ? 'webgl' : 'webgl2');
    return new rendererClass(gl, type, canvas) as GLRenderer;
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

  constructor(
    gl: AnyWebRenderingGLContext,
    public type: GLRendererType,
    public canvas: HTMLCanvasElement,
    mainViewportState?: GLViewportState,
  ) {
    super(gl);
    this._width = canvas.width;
    this._height = canvas.height;

    const finalMainViewportState = mainViewportState || {
      width: this._width,
      height: this._height,
    };

    this._viewportStack = new GLViewportStack(gl, finalMainViewportState);

    this._clearColor = vec4.fromValues(0, 0, 0, 1);
    this.gl.clearColor(this._clearColor[0], this._clearColor[1], this._clearColor[2], this._clearColor[3]);

    this.setup();
  }

  set clearColor(clearColor: vec4) {
    vec4.copy(this._clearColor, clearColor);
    this.gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
  }

  setup(): void {
    const gl = this.gl;
    gl.enable(gl.CULL_FACE); // Active le test de profondeur
    gl.enable(gl.DEPTH_TEST); // Active le test de profondeur
    gl.depthFunc(gl.LESS); // Les objets proches cachent les objets lointains

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  prepareFrame(): void {
    this._viewportStack.reset();
  }

  clear(clearFlag: number = this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT): void {
    this.gl.clear(clearFlag);
  }

  destroy(): void {}
}
