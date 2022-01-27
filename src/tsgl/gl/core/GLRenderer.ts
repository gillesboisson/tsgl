import { vec4 } from 'gl-matrix';
import { AnyWebRenderingGLContext } from './GLHelpers';
import { GLCore } from './GLCore';
import { IShaderRegisterer } from './shader/GLShader';
import { IGLShaderState } from './shader/IGLShaderState';
import { IShaderCreateState } from './shader/IShaderProgram';
import { IGLFrameBuffer } from './framebuffer/IGLFrameBuffer';
import { IResize } from '../../common/IResize';
import { GLBaseRenderPass } from "../renderPass/GLBaseRenderPass";
import { GLRenderPassState } from "../renderPass/GLRenderPassState";

export enum GLRendererType {
  WebGL,
  WebGL2,
}

export type WebGL2Renderer = GLRenderer<WebGL2RenderingContext>;
export type WebGL1Renderer = GLRenderer<WebGLRenderingContext>;
export class GLRenderer<GLContext extends AnyWebRenderingGLContext = AnyWebRenderingGLContext> extends GLCore<
  GLContext
> {
  protected depthTestEnabled: boolean;
  protected depthFunction: number;
  protected alphaBlendingEnabled: boolean;
  protected alphaBlendingFuncSfactor: number;
  protected alphaBlendingFuncDfactor: number;
  protected viewportX: number;
  protected viewportY: number;
  protected viewportWidth: number;
  protected viewportHeight: number;
  protected clearOnBegin: number;
  protected faceCullingEnabled: boolean;
  protected framebuffer: IGLFrameBuffer | null = null;
  protected clearColorR: number;
  protected clearColorG: number;
  protected clearColorB: number;
  protected clearColorA: number;

  protected _shaders: { [key: string]: IShaderCreateState<IGLShaderState> } = {};
  protected _shadersFactories: {
    [key: string]: (gl: GLContext, name: string) => IShaderCreateState<IGLShaderState>;
  } = {};

  public registerShaderFactory(factory: IShaderRegisterer): void {
    factory.register(this);
  }

  public registerShaderFactoryFunction(
    name: string,
    shaderFactory: (gl: GLContext, name: string) => IShaderCreateState<IGLShaderState>,
  ): void {
    if (this._shadersFactories[name] === undefined) this._shadersFactories[name] = shaderFactory;
  }

  public registerShader(name: string, shader: IShaderCreateState<IGLShaderState>): void {
    if (this._shaders[name] === undefined) this._shaders[name] = shader;
  }

  public getShader<ShaderStateT extends IGLShaderState>(name: string): IShaderCreateState<ShaderStateT> {
    let shader: IShaderCreateState<ShaderStateT> = null;
    if (this._shaders[name] === undefined) {
      if (this._shadersFactories[name] === undefined) throw new Error(`Shader ${name} not found`);

      this._shaders[name] = shader = this._shadersFactories[name](this.gl as GLContext, name) as IShaderCreateState<
        ShaderStateT
      >;
    } else {
      shader = this._shaders[name] as IShaderCreateState<ShaderStateT>;
    }

    return shader;
  }

  public createShaderState<ShaderStateT extends IGLShaderState>(name: string): ShaderStateT {
    const shader: IShaderCreateState<ShaderStateT> = this.getShader(name);
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
    webGLOptions: any = {},

    rendererClass: any = GLRenderer,
  ): GLRenderer {
    const gl = canvas.getContext(type === GLRendererType.WebGL ? 'webgl' : 'webgl2', webGLOptions);
    return new rendererClass(gl, type, canvas) as GLRenderer;
  }

  static create(
    width: number,
    height: number,
    type: GLRendererType = GLRendererType.WebGL,
    webGLOptions: any = {},

    rendererClass: any = GLRenderer,
  ): GLRenderer {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return this.createFromCanvas(canvas, type, rendererClass, webGLOptions);
  }

  private _width: number;
  private _height: number;
  private _clearColor: vec4;

  defaultRenderPass: GLBaseRenderPass;

  constructor(gl: GLContext, public type: GLRendererType, public canvas: HTMLCanvasElement) {
    super(gl);
    this._width = canvas.width;
    this._height = canvas.height;

    this._clearColor = vec4.fromValues(0, 0, 0, 1);
    this.gl.clearColor(this._clearColor[0], this._clearColor[1], this._clearColor[2], this._clearColor[3]);

    this.defaultRenderPass = new GLBaseRenderPass(this, {
      viewportX: 0,
      viewportY: 0,
      viewportWidth: this.width,
      viewportHeight: this.height,
      clearOnBegin: gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT,
    });
  }

  set clearColor(clearColor: vec4) {
    vec4.copy(this._clearColor, clearColor);
    this.gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
  }

  resize(width: number, height: number): void {
    this._width = width;
    this._height = height;

    this.canvas.width = width;
    this.canvas.height = height;

    this.defaultRenderPass.viewportWidth = width;
    this.defaultRenderPass.viewportHeight = height;
  }

  setGLPassState<FramebufferT extends IGLFrameBuffer & IResize>(
    passState: GLRenderPassState<FramebufferT>,
    forceUpdate = false,
  ): void {
    const gl = this.gl;

    if (passState.depthTestEnabled !== this.depthTestEnabled || forceUpdate === true) {
      this.depthTestEnabled = passState.depthTestEnabled;
      if (passState.depthTestEnabled === true) {
        gl.enable(gl.DEPTH_TEST);
      } else {
        gl.disable(gl.DEPTH_TEST);
      }
    }

    if (passState.depthFunction !== this.depthFunction || forceUpdate === true) {
      this.depthFunction = passState.depthFunction;

      if (passState.depthTestEnabled === true) {
        gl.depthFunc(this.depthFunction);
      }
    }

    if (passState.faceCullingEnabled !== this.faceCullingEnabled || forceUpdate === true) {
      this.faceCullingEnabled = passState.faceCullingEnabled;

      if (passState.faceCullingEnabled === true) {
        gl.enable(gl.CULL_FACE);
      } else {
        gl.disable(gl.CULL_FACE);
      }
    }

    if (passState.alphaBlendingEnabled !== this.alphaBlendingEnabled || forceUpdate === true) {
      this.alphaBlendingEnabled = passState.alphaBlendingEnabled;

      if (passState.alphaBlendingEnabled === true) {
        gl.enable(gl.BLEND);
      } else {
        gl.disable(gl.BLEND);
      }
    }
    if (
      passState.alphaBlendingFuncSfactor !== this.alphaBlendingFuncSfactor ||
      passState.alphaBlendingFuncDfactor !== this.alphaBlendingFuncDfactor ||
      forceUpdate === true
    ) {
      this.alphaBlendingFuncSfactor = passState.alphaBlendingFuncSfactor;
      this.alphaBlendingFuncDfactor = passState.alphaBlendingFuncDfactor;

      if (passState.alphaBlendingEnabled === true) {
        gl.blendFunc(passState.alphaBlendingFuncSfactor, passState.alphaBlendingFuncDfactor);
      }
    }

    if (passState.framebuffer !== this.framebuffer || forceUpdate === true) {
      this.framebuffer = passState.framebuffer;
      if (this.framebuffer !== null) {
        this.framebuffer.bind();
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
    }

    if (
      passState.viewportX !== this.viewportX ||
      passState.viewportY !== this.viewportY ||
      passState.viewportWidth !== this.viewportWidth ||
      passState.viewportHeight !== this.viewportHeight ||
      forceUpdate === true
    ) {
      this.viewportX = passState.viewportX;
      this.viewportY = passState.viewportY;
      this.viewportWidth = passState.viewportWidth;
      this.viewportHeight = passState.viewportHeight;

      gl.viewport(passState.viewportX, passState.viewportY, passState.viewportWidth, passState.viewportHeight);
    }

    if (
      passState.clearColorR !== this.clearColorR ||
      passState.clearColorG !== this.clearColorG ||
      passState.clearColorB !== this.clearColorB ||
      passState.clearColorA !== this.clearColorA ||
      forceUpdate === true
    ) {
      this.clearColorR = passState.clearColorR;
      this.clearColorG = passState.clearColorG;
      this.clearColorB = passState.clearColorB;
      this.clearColorA = passState.clearColorA;

      if (passState.clearOnBegin !== 0) {
        gl.clearColor(this.clearColorR, this.clearColorG, this.clearColorB, this.clearColorA);
      }
    }

    if (passState.clearOnBegin !== this.clearOnBegin || forceUpdate === true) {
      this.clearOnBegin = passState.clearOnBegin;
    }

    if (passState.clearOnBegin !== 0) {
      gl.clear(this.clearOnBegin);
    }
  }

  prepareFrame(): void {}

  destroy(): void {}
}
