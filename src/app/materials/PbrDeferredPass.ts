import { vec2, vec3, vec4 } from 'gl-matrix';
import { Camera } from '../../tsgl/3d/Camera';
import { ShadowMap } from '../../tsgl/3d/ShadowMap';
import { GLDefaultTextureLocation } from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { WebGL2Renderer } from '../../tsgl/gl/core/GLRenderer';
import { GLTexture2D, IGLTexture } from '../../tsgl/gl/core/texture/GLTexture';
import { mapMRTTexturesToProcessPassTexturesLocations } from '../../tsgl/helpers/postprocess/mapMRTTexturesToProcessPassTexturesLocations';
import { ProcessPass } from '../../tsgl/helpers/postprocess/PostProcessPass';
import { PbrShaderDebug } from '../../tsgl/shaders/PbrVShader';
import { DeferredFrameBuffer } from '../DeferredFrameBuffer';
import { PbrDeferredVShaderID } from '../shaders/PbrDeferredVShader';
import { PbrDeferredVShadersState } from '../shaders/PbrDeferredVShadersState';

export interface PbrDeferredPassData {
  cam: Camera;
}

export class PbrDeferredPass extends ProcessPass<PbrDeferredVShadersState, PbrDeferredPassData> {
  protected _irradianceMap: IGLTexture;
  protected _extraMap: IGLTexture;
  private _shadowMap: ShadowMap;
  private _gammaCorrectionEnabled: boolean;
  private _emissiveMap: IGLTexture;
  private _ssaoMap: GLTexture2D<
    import('/home/gillesboisson/Projects/sandbox/TsGL2D/src/tsgl/gl/core/GLHelpers').AnyWebRenderingGLContext
  >;

  // private _shadowMap: ShadowMap;

  constructor(
    renderer: WebGL2Renderer,
    readonly framebuffer: DeferredFrameBuffer,
    public lightDirection: vec3,
    readonly irradianceMap: IGLTexture,
    readonly reflectanceMap: IGLTexture,
  ) {
    super(renderer, [], renderer.getShader<PbrDeferredVShadersState>(PbrDeferredVShaderID));

    this._shaderState?.setVariantValue('emissiveMap', framebuffer.emissiveEnabled);
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

  get shadowMap(): ShadowMap {
    return this._shadowMap;
  }

  set shadowMap(val: ShadowMap) {
    if (val !== this._shadowMap) {
      this._shadowMap = val;
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

  prepare(gl: WebGL2RenderingContext, renderData: PbrDeferredPassData): void {
    const ss = this._shaderState;
    const framebuffer = this.framebuffer;
    ss.use();

    ss.lightDirection = this.lightDirection;

    ss.cameraPosition = renderData.cam.transform.getRawPosition();

    // vec3.negate(ss.cameraPosition, renderData.cam.transform.getRawPosition());

    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.COLOR);
    gl.bindTexture(gl.TEXTURE_2D, framebuffer.albedo.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.NORMAL);
    gl.bindTexture(gl.TEXTURE_2D, framebuffer.normalMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.POSITION);
    gl.bindTexture(gl.TEXTURE_2D, framebuffer.positionMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.PBR_0);
    gl.bindTexture(gl.TEXTURE_2D, framebuffer.pbrMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.DEPTH);
    gl.bindTexture(gl.TEXTURE_2D, framebuffer.depthTexture.texture);

    if (this._ssaoMap) {
      this._ssaoMap.active(GLDefaultTextureLocation.AMBIANT_OCCLUSION);
    }

    if (framebuffer.emissiveEnabled) {
      framebuffer.emissiveMap.active(GLDefaultTextureLocation.EMISSIVE);
    }

    this.irradianceMap.active(GLDefaultTextureLocation.IRRADIANCE_BOX);
    this.reflectanceMap.active(GLDefaultTextureLocation.RELEXION_BOX);

    if (this._shadowMap) {
      this._shadowMap.depthTexture.active(GLDefaultTextureLocation.SHADOW_MAP_0);
      vec2.set(ss.shadowMapPixelSize, 1 / this._shadowMap.depthTexture.width, 1 / this._shadowMap.depthTexture.height);
      this._shadowMap.depthBiasVp(ss.depthBiasMvpMat);
    }

    vec2.copy(ss.gammaExposure, this._gammaExposure);

    this._shaderState.syncUniforms();
  }
}
