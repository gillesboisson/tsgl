import { vec4, mat4, vec3, vec2 } from 'gl-matrix';
import { Camera } from '../../tsgl/3d/Camera';
import { AMaterial } from '../../tsgl/3d/Material/Material';
import { GLDefaultTextureLocation } from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../tsgl/gl/core/GLHelpers';
import { GLRenderer } from '../../tsgl/gl/core/GLRenderer';
import { IGLTexture } from '../../tsgl/gl/core/texture/GLTexture';
import { DeferredPrepassVShaderID } from '../shaders/DeferredPrepassVShader';
import { DeferredPrepassVShadersState } from '../shaders/DeferredPrepassVShadersState';

export class DeferredPrepassMaterial extends AMaterial<DeferredPrepassVShadersState> {
  constructor(renderer: GLRenderer) {
    super();

    this._shaderState = renderer.getShader(DeferredPrepassVShaderID).createState() as DeferredPrepassVShadersState;
  }

  protected _normalMap: IGLTexture;
  protected _diffuseMap: IGLTexture;
  protected _emissiveMap: IGLTexture;
  protected _pbrMap: IGLTexture;
  protected _occlusionMap: IGLTexture;

  public roughness = 0;
  public metallic = 0;
  public ambiantOcclusion = 1;

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
  // protected _occlusionMapEnabled = false;

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

  get pbrMap(): IGLTexture {
    return this._pbrMap;
  }

  set pbrMap(val: IGLTexture) {
    if (val !== this._pbrMap) {
      this._pbrMap = val;

      if (this._shaderState.getVariantValue('pbr') !== 'off') {
        this._shaderState?.setVariantValue('pbr', val ? 'map' : 'val');
      }
    }
  }

  get occlusionMap(): IGLTexture {
    return this._occlusionMap;
  }

  set occlusionMap(val: IGLTexture) {
    if (val !== this._occlusionMap) {
      this._occlusionMap = val;
      this.updateOcclusionMode();
    }
  }

  get emissiveMap(): IGLTexture {
    return this._emissiveMap;
  }

  set emissiveMap(val: IGLTexture) {
    if (val !== this._emissiveMap) {
      this._emissiveMap = val;
      this._shaderState?.setVariantValue('emissiveMap', !!val);
    }
  }

  get pbrEnabled(): boolean {
    return !!(this._shaderState?.getVariantValue('pbr') !== 'off');
  }

  set pbrEnabled(val: boolean) {
    let pbrVal: 'val' | 'map' | 'off' = 'off';

    if (val) {
      pbrVal = this._pbrMap ? 'map' : 'val';
    }

    this._shaderState?.setVariantValue('pbr', pbrVal);
  }

  protected updateOcclusionMode(): void {
    switch (true) {
      case this._occlusionMap === this._pbrMap && !!this._pbrMap:
        this._shaderState?.setVariantValue('occlusion', 'pbr');
        break;
      case !!this._occlusionMap:
        this._shaderState?.setVariantValue('occlusion', 'on');
        break;
      default:
        this._shaderState?.setVariantValue('occlusion', 'off');
        break;
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

  // protected updateOcclusionMap(): void {
  //   this._shaderState?.setVariantValue('occlusionMap', this._extraMap && this._occlusionMapEnabled);
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void {
    const ss = this._shaderState;
    ss.use();

    cam.normalMat(ss.normalMat, transformMat);
    cam.mvp(ss.mvpMat, transformMat);
    ss.modelMat = transformMat;

    if (this._diffuseMap) {
      this._diffuseMap.active(GLDefaultTextureLocation.COLOR);
    } else {
      vec4.copy(ss.diffuseColor, this._diffuseColor);
    }

    if (this._normalMap) {
      this._normalMap.active(GLDefaultTextureLocation.NORMAL);
    }

    if (this._emissiveMap) {
      this._emissiveMap.active(GLDefaultTextureLocation.EMISSIVE);
    }

    if (this._occlusionMap) {
      this._occlusionMap.active(GLDefaultTextureLocation.AMBIANT_OCCLUSION);
    }

    if (this._pbrMap) {
      this._pbrMap.active(GLDefaultTextureLocation.PBR_0);
    }

    ss.setPbr(this.ambiantOcclusion, this.roughness, this.metallic);

    // if (this._extraMap) {
    //   this._extraMap.active(GLDefaultTextureLocation.PBR_0);
    // }

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

    // if (this._extraMap) {
    //   this._extraMap.unbind();
    // }
  }
}
