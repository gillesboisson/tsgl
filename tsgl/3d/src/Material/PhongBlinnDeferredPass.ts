import { vec2, vec3 } from 'gl-matrix';
import { Camera, PostProcessPass } from '@tsgl/common';
import { IGLTexture, WebGL2Renderer, GLDefaultTextureLocation } from '@tsgl/gl';
import { DeferredFrameBuffer } from '../deferred/DeferredFrameBuffer';
import { PhongBlinnLightInterface, PhongBlinnShaderDebug } from '../shaders/phongBlinn-v/PhongBlinnVShader';
import { PhongBlinnDeferredVShadersState, PhongBlinnDeferredVShaderID } from '../shaders/phongBlinnDeferred-v';
import { ShadowMap } from '../ShadowMap';


export interface PhongBlinnDeferredPassData {
  cam: Camera;
}



export class PhongBlinnDeferredPass extends PostProcessPass<PhongBlinnDeferredVShadersState, PhongBlinnDeferredPassData> {
  protected _irradianceMap: IGLTexture;
  protected _extraMap: IGLTexture;
  private _shadowMap: ShadowMap;
  // private _shadowMap: ShadowMap;

  constructor(
    renderer: WebGL2Renderer,
    readonly framebuffer: DeferredFrameBuffer,
    public light: PhongBlinnLightInterface,
  ) {
    super(renderer, [],{
      viewportX: 0,
      viewportY: 0,
      viewportWidth: renderer.width,
      viewportHeight: renderer.height,
    }, renderer.getShader<PhongBlinnDeferredVShadersState>(PhongBlinnDeferredVShaderID));
  }

  protected _occlusionMapEnabled = false;

  get irradianceMap(): IGLTexture {
    return this._irradianceMap;
  }

  set irradianceMap(val: IGLTexture) {
    if (val !== this._irradianceMap) {
      this._irradianceMap = val;
      this._shaderState?.setVariantValue('ambiant', val ? 'irradiance' : 'color');
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

  set occlusionMapEnabled(val: boolean) {
    if (val !== this._occlusionMapEnabled) {
      this._occlusionMapEnabled = val;
      this.updateOcclusionMap();
    }
  }

  private _debug: PhongBlinnShaderDebug;

  
  get debug():PhongBlinnShaderDebug{
    return this._shaderState.getVariantValue('debug') as PhongBlinnShaderDebug;
  }
  
  set debug(val:PhongBlinnShaderDebug){
    if(val !== this._debug){
      this._shaderState.setVariantValue('debug',val);
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

  protected updateOcclusionMap(): void {
    this._shaderState?.setVariantValue('occlusionMap', this._extraMap && this._occlusionMapEnabled);
  }

  prepare(gl: WebGL2RenderingContext, shaderState: PhongBlinnDeferredVShadersState ,renderData: PhongBlinnDeferredPassData): void {
    const light = this.light;
    shaderState.use();

    shaderState.lightDirection = light.direction;
    shaderState.lightColor = light.color;
    shaderState.specularColor = light.specularColor;
    shaderState.ambiantColor = light.ambiantColor;
    shaderState.lightShininess = light.shininess;

    vec3.negate(shaderState.cameraPosition, renderData.cam.transform.getRawPosition());

    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.COLOR);
    gl.bindTexture(gl.TEXTURE_2D, this.framebuffer.albedo.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.NORMAL);
    gl.bindTexture(gl.TEXTURE_2D, this.framebuffer.normalMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.POSITION);
    gl.bindTexture(gl.TEXTURE_2D, this.framebuffer.positionMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.DEPTH);
    gl.bindTexture(gl.TEXTURE_2D, this.framebuffer.depthTexture.texture);

    if (this._irradianceMap) {
      this._irradianceMap.active(GLDefaultTextureLocation.IRRADIANCE_BOX);
    }

    if (this._extraMap) {
      this._extraMap.active(GLDefaultTextureLocation.PBR_0);
    }

    if (this._shadowMap) {
      this._shadowMap.depthTexture.active(GLDefaultTextureLocation.SHADOW_MAP_0);
      vec2.set(shaderState.shadowMapPixelSize,1 / this._shadowMap.depthTexture.width,1 / this._shadowMap.depthTexture.height);
      this._shadowMap.depthBiasVp(shaderState.depthBiasMvpMat);

    }

    this._shaderState.syncUniforms();
  }
}
