import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import { DeferredFrameBuffer } from '../deferred/DeferredFrameBuffer';
import { PbrDeferredVShadersState } from '../shaders/pbrDeferred-v/PbrDeferredVShadersState';
import { PbrDeferredVShaderID } from '../shaders/pbrDeferred-v/PbrDeferredVShader';
import { IGLTexture, GLTexture2D, WebGL2Renderer, GLDefaultTextureLocation, AnyWebRenderingGLContext } from '../../gl';
import { Camera, PostProcessPass } from '../../common';
import { ShadowPass } from '../ShadowPass';
import { PbrShaderDebug } from '../shaders/pbr-v/PbrVShader';


export interface PbrDeferredPassData {
  cam: Camera;
}

export class PbrDeferredPass extends PostProcessPass<PbrDeferredVShadersState, PbrDeferredPassData> {
  protected _irradianceMap: IGLTexture;
  protected _extraMap: IGLTexture;
  private _shadowPass: ShadowPass;
  private _gammaCorrectionEnabled: boolean;
  private _emissiveMap: IGLTexture;
  private _ssaoMap: GLTexture2D<
    AnyWebRenderingGLContext
  >;

  // private _shadowPass: ShadowPass;

  constructor(
    renderer: WebGL2Renderer,
    readonly sourceFramebuffer: DeferredFrameBuffer,
    public lightDirection: vec3,
    readonly irradianceMap: IGLTexture,
    readonly reflectanceMap: IGLTexture,
  ) {
    super(renderer, [],{
      viewportX: 0,
      viewportY: 0,
      viewportWidth: renderer.width,
      viewportHeight: renderer.height,
    }, renderer.getShader<PbrDeferredVShadersState>(PbrDeferredVShaderID));

    this._shaderState?.setVariantValue('emissiveMap', sourceFramebuffer.emissiveEnabled);
  }

  protected _occlusionMapEnabled = false;

  private _debug: PbrShaderDebug;

  get debug(): PbrShaderDebug {
    return this._shaderState.getVariantValue('debug') as PbrShaderDebug;
  }

  set debug(val: PbrShaderDebug) {
    if (val !== this._debug) {
      this._shaderState.setVariantValue('debug', val);
    }
  }

  get aoEnabled(): boolean {
    return this._shaderState.getVariantValue('occlusion') !== 'off';
  }

  enablePbrAO(): void {
    this._shaderState.setVariantValue('occlusion', 'pbr');
  }

  enableSSAO(ssaoTexture: GLTexture2D): void {
    this._shaderState.setVariantValue('occlusion', 'ssao');
    this._ssaoMap = ssaoTexture;
  }

  disableAO(): void {
    this._shaderState.setVariantValue('occlusion', 'off');
  }

  enableHDRCorrection(): void {
    this._shaderState?.setVariantValue('gammaCorrection', true);
  }

  disableHDRCorrection(): void {
    this._shaderState?.setVariantValue('gammaCorrection', false);
  }

  protected _gammaExposure = vec2.fromValues(2.0, 1.0);

  setGamma(gamma: number, enableCorrection = true): void {
    if (enableCorrection) {
      this.enableHDRCorrection();
    }

    this._gammaExposure[0] = gamma;
  }

  setExposure(exposure: number, enableCorrection = true): void {
    if (enableCorrection) {
      this.enableHDRCorrection();
    }

    this._gammaExposure[1] = exposure;
  }

  setGammaExposure(gamma: number, exposure: number, enableCorrection = true): void {
    if (enableCorrection) {
      this.enableHDRCorrection();
    }

    this._gammaExposure[0] = gamma;
    this._gammaExposure[1] = exposure;
  }

  get shadowPass(): ShadowPass {
    return this._shadowPass;
  }

  set shadowPass(val: ShadowPass) {
    if (val !== this._shadowPass) {
      this._shadowPass = val;
      this._shaderState?.setVariantValue('shadowMap', val ? 'pcf' : 'off');
    }
  }

  get gamma(): number {
    return this._gammaExposure[0];
  }

  get exposure(): number {
    return this._gammaExposure[1];
  }

  get hdrCorrectionEnabled(): boolean {
    return this._shaderState.getVariantValue('gammaCorrection') as boolean;
  }

  protected updateOcclusionMap(): void {
    this._shaderState?.setVariantValue('occlusionMap', this._extraMap && this._occlusionMapEnabled);
  }

  prepare(gl: WebGL2RenderingContext, shaderState: PbrDeferredVShadersState, renderData: PbrDeferredPassData): void {
    const sourceFramebuffer = this.sourceFramebuffer;
    shaderState.use();

    shaderState.lightDirection = this.lightDirection;
    const cam = renderData.cam;
    shaderState.cameraPosition = cam.transform.getRawPosition();

    // vec3.negate(shaderState.cameraPosition, renderData.cam.transform.getRawPosition());

    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.COLOR);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.albedo.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.NORMAL);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.normalMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.POSITION);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.positionMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.PBR_0);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.pbrMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.DEPTH);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.depthTexture.texture);

    if (this._ssaoMap) {
      this._ssaoMap.active(GLDefaultTextureLocation.AMBIANT_OCCLUSION);
    }

    if (sourceFramebuffer.emissiveEnabled) {
      sourceFramebuffer.emissiveMap.active(GLDefaultTextureLocation.EMISSIVE);
    }

    this.irradianceMap.active(GLDefaultTextureLocation.IRRADIANCE_BOX);
    this.reflectanceMap.active(GLDefaultTextureLocation.RELEXION_BOX);

    // mat4.invert(shaderState.viewInvertedRotationMat, cam.invertWorldMat);
    mat4.transpose(shaderState.viewInvertedRotationMat, cam.invertWorldMat);

    if (this._shadowPass) {
      const depthTexture = this._shadowPass.framebuffer.depthTexture;
      depthTexture.active(GLDefaultTextureLocation.SHADOW_MAP_0);
      vec2.set(shaderState.shadowMapPixelSize, 1 / depthTexture.width, 1 / depthTexture.height);
      this._shadowPass.depthBiasVpInForViewSpaceData(shaderState.depthBiasMvpMat, cam);
    }

    vec2.copy(shaderState.gammaExposure, this._gammaExposure);

    this._shaderState.syncUniforms();
  }
}
