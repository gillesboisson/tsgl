import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import { GLDefaultTextureLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { GLTexture } from '../../gl/core/GLTexture';
import { PbrVShaderID } from '../../shaders/PbrVShader';
import { PbrVShadersState } from '../../shaders/PbrVShadersState';
import { Camera } from '../Camera';
import { ShadowMap } from '../ShadowMap';
import { AMaterial } from './Material';

export class PbrMaterial extends AMaterial<PbrVShadersState> {

  protected _gammaExposure = vec2.fromValues(2.0, 1.0);

  constructor(
    renderer: GLRenderer,
    readonly lightDirection: vec3,

    readonly irradianceMap: GLTexture,
    readonly reflectanceMap: GLTexture,
  ) {
    super();

    this._shaderState = renderer.getShader(PbrVShaderID).createState() as PbrVShadersState;
  }

  protected _diffuseColor = vec4.fromValues(1, 1, 1, 1);
  protected _pbr = vec4.create();

  protected _diffuseMap: GLTexture;
  protected _pbrMap: GLTexture;
  protected _normalMap: GLTexture;
  protected _shadowMap: ShadowMap;
  protected _tbnEnabled: boolean;


  enableHDRCorrection(): void{
    this._shaderState?.setVariantValue('gammaCorrection',true);
  }

  disableHDRCorrection(): void{
    this._shaderState?.setVariantValue('gammaCorrection',false);
  }

  setGamma(gamma: number, enableCorrection = true): void{
    if(enableCorrection){
      this.enableHDRCorrection();
    }

    this._gammaExposure[0] = gamma;
  }

  setExposure(exposure: number, enableCorrection = true): void{
    if(enableCorrection){
      this.enableHDRCorrection();
    }

    this._gammaExposure[1] = exposure;

  }

  setGammaExposure(gamma: number,exposure: number, enableCorrection = true): void{
    if(enableCorrection){
      this.enableHDRCorrection();
    }

    this._gammaExposure[0] = gamma;
    this._gammaExposure[1] = exposure;

  }


  get gamma(): number{
    return this._gammaExposure[0];
  }

  get exposure(): number{
    return this._gammaExposure[1];
  }

  get hdrCorrectionEnabled(): boolean{
    return this._shaderState.getVariantValue('gammaCorrection') as boolean;
  }
  



  get diffuseMap(): GLTexture {
    return this._diffuseMap;
  }

  set diffuseMap(val: GLTexture) {
    if (val !== this._diffuseMap) {
      this._diffuseMap = val;
      this._shaderState?.setVariantValue('diffuse', val ? 'texture' : 'color');
    }
  }

  get pbrMap(): GLTexture {
    return this._pbrMap;
  }

  set pbrMap(val: GLTexture) {
    if (val !== this._pbrMap) {
      this._pbrMap = val;
      this._shaderState?.setVariantValue('pbrMap', !!val);
    }
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

  get normalMap(): GLTexture {
    return this._normalMap;
  }

  set normalMap(val: GLTexture) {
    if (val !== this._normalMap) {
      this._normalMap = val;
      this.updateNormalMode();
    }
  }

  get tbnEnabled(): boolean {
    return this._tbnEnabled;
  }

  set tbnEnabled(val: boolean) {
    if (val !== this._tbnEnabled) {
      this._tbnEnabled = val;
      this.updateNormalMode();
    }
  }

  protected updateNormalMode(): void {
    switch (true) {
      case this._normalMap && this._tbnEnabled:
        this._shaderState?.setVariantValue('normal', 'tbn');
        break;
      case this._normalMap && !this._tbnEnabled:
        this._shaderState?.setVariantValue('normal', 'map');
        break;
      default:
        this._shaderState?.setVariantValue('normal', 'vertex');
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void {
    const ss = this._shaderState;
    ss.use();
    cam.mvp(ss.mvpMat, transformMat);

    cam.normalMat(ss.normalMat, transformMat);
    ss.modelMat = transformMat;

    vec3.copy(ss.lightDirection, this.lightDirection);
    vec4.copy(ss.diffuseColor, this._diffuseColor);

    vec2.copy(ss.gammaExposure, this._gammaExposure);

    ss.cameraPosition = cam.transform.getRawPosition();

    this.irradianceMap.active(GLDefaultTextureLocation.IRRADIANCE_BOX);
    this.reflectanceMap.active(GLDefaultTextureLocation.RELEXION_BOX);

    if (this._shadowMap) {
      this._shadowMap.depthBiasMvp(ss.depthBiasMvpMat, transformMat);
      vec2.set(ss.shadowMapPixelSize, 1 / this.shadowMap.depthTexture.width, 1 / this.shadowMap.depthTexture.height);
      this._shadowMap.depthTexture.active(GLDefaultTextureLocation.SHADOW_MAP_0);
    }

    if (this._diffuseMap) {
      this._diffuseMap.active(GLDefaultTextureLocation.COLOR);
    }

    if (this._normalMap) {
      this._normalMap.active(GLDefaultTextureLocation.NORMAL);
    }

    if (this._pbrMap) {
      this._pbrMap.active(GLDefaultTextureLocation.PBR_0);
    } else {
      ss.setPbr(this.ambiantOcclusion, this.roughness, this.metallic);
    }

    ss.syncUniforms();
  }

  public setDiffuseColor(r: number, g: number, b: number, a = 1.0): void {
    vec4.set(this._diffuseColor, r, g, b, a);
  }

  public copyDiffuseColor(sourceColor: vec4): void {
    vec4.copy(this._diffuseColor, sourceColor);
  }

  get rawDiffuseColor(): vec4 {
    return this._diffuseColor;
  }

  get diffuseColor(): vec4 {
    return vec4.clone(this._diffuseColor);
  }

  public roughness = 0;
  public metallic = 0;
  public ambiantOcclusion = 1;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(gl: AnyWebRenderingGLContext): void {}
}