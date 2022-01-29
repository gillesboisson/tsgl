import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import { Camera } from '../../tsgl/common';
import { AMaterial } from '../../tsgl/3d';
import { ShadowMap } from '../../tsgl/3d';
import { GLDefaultTextureLocation } from '../../tsgl/gl';
import { AnyWebRenderingGLContext } from '../../tsgl/gl';
import { GLRenderer } from '../../tsgl/gl';
import { IGLTexture } from '../../tsgl/gl';
import { PhongBlinnDeferredVShadersState, PhongBlinnDeferredShaderDebug, PhongBlinnDeferredLightInterface, PhongBlinnDeferredVShaderID } from '../shaders/phongBlinnDeferred-v';



export class PhongBlinnDeferredMaterial extends AMaterial<PhongBlinnDeferredVShadersState> {
  private _debug: PhongBlinnDeferredShaderDebug;
  private _shadowMap: ShadowMap;
  constructor(renderer: GLRenderer, public light: PhongBlinnDeferredLightInterface) {
    super();

    this._shaderState = renderer.getShader(PhongBlinnDeferredVShaderID).createState() as PhongBlinnDeferredVShadersState;
  }

  protected _normalMap: IGLTexture;
  protected _irradianceMap: IGLTexture;
  protected _extraMap: IGLTexture;


  protected _diffuseMap: IGLTexture;

  protected _diffuseColor: vec4 = vec4.fromValues(1, 1, 1, 1);


  public setDiffuseColor(r: number, g = r, b = r, a = 1): void {
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




  // occlusion map enabled (extra map need to be provided)
  protected _occlusionMapEnabled = false;

  // Tangent, Bilinear tangent, normal enabled (normal map need to be provided)
  protected _tbnEnabled = false;

  get diffuseMap(): IGLTexture {
    return this._diffuseMap;
  }

  set diffuseMap(val: IGLTexture) {
    if (val !== this._diffuseMap) {
      this._diffuseMap = val;
      this._shaderState?.setVariantValue('diffuse', val ? 'texture' : 'color');
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

  get normalMap(): IGLTexture {
    return this._normalMap;
  }

  set normalMap(val: IGLTexture) {
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

  get extraMap(): IGLTexture {
    return this._extraMap;
  }

  set extraMap(val: IGLTexture) {
    if (val !== this._extraMap) {
      this._extraMap = val;
      this.updateOcclusionMap();
    }
  }

  get irradianceMap(): IGLTexture {
    return this._irradianceMap;
  }

  set irradianceMap(val: IGLTexture) {
    if (val !== this._irradianceMap) {
      this._irradianceMap = val;
      this._shaderState?.setVariantValue('ambiant', val ? 'irradiance' : 'color');
    }
  }

  get occlusionMapEnabled(): boolean {
    return this._occlusionMapEnabled;
  }

  set occlusionMapEnabled(val: boolean) {
    if (val !== this._occlusionMapEnabled) {
      this._occlusionMapEnabled = val;
      this.updateOcclusionMap();
    }
  }

  get debug():PhongBlinnDeferredShaderDebug{
    return this._shaderState.getVariantValue('debug') as PhongBlinnDeferredShaderDebug;
  }
  
  set debug(val:PhongBlinnDeferredShaderDebug){
    if(val !== this._debug){
      this._shaderState.setVariantValue('debug',val);
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
        this._shaderState?.setVariantValue('normal' , 'vertex');
        break;
    }
  }

  protected updateOcclusionMap(): void {
    this._shaderState?.setVariantValue('occlusionMap', this._extraMap && this._occlusionMapEnabled);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void {
    const ss = this._shaderState;
    const light = this.light;
    ss.use();

    // light
    ss.lightDirection = light.direction;
    ss.lightColor = light.color;
    ss.specularColor = light.specularColor;
    ss.ambiantColor = light.ambiantColor;
    ss.lightShininess = light.shininess;
    ss.diffuseColor = this._diffuseColor;

    // cam.mvp(ss.mvpMat, transformMat);
    // cam.normalMat(ss.normalMat, transformMat);
    // ss.modelMat = transformMat;
    vec3.negate(ss.cameraPosition, cam.transform.getRawPosition());

    if(this._shadowMap){
      this._shadowMap.depthBiasMvp(ss.depthBiasMvpMat,transformMat);
      vec2.set(ss.shadowMapPixelSize,1 / this.shadowMap.depthTexture.width,1 / this.shadowMap.depthTexture.height);
      this._shadowMap.depthTexture.active(GLDefaultTextureLocation.SHADOW_MAP_0);
    }

    if (this._diffuseMap) {
      this._diffuseMap.active(GLDefaultTextureLocation.COLOR);
    }

    if (this._normalMap) {
      this._normalMap.active(GLDefaultTextureLocation.NORMAL);
    }

    if (this._irradianceMap) {
      this._irradianceMap.active(GLDefaultTextureLocation.IRRADIANCE_BOX);
    }

    if (this._extraMap) {
      this._extraMap.active(GLDefaultTextureLocation.PBR_0);
    }

    ss.syncUniforms();

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(gl: AnyWebRenderingGLContext): void {

    if (this._diffuseMap) {
      this._diffuseMap.unbind();
    }

    if (this._normalMap) {
      this._normalMap.unbind();
    }

    if (this._irradianceMap) {
      this._irradianceMap.unbind();
    }

    if (this._extraMap) {
      this._extraMap.unbind();
    }
  }
}
