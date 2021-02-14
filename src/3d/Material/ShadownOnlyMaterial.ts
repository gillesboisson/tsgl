import { mat4, vec3 } from 'gl-matrix';
import { GLDefaultTextureLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { ShadowOnlyShaderState, ShadowOnlyShaderID } from '../../shaders/ShadowOnlyShader';
import { Camera } from '../Camera';
import { ShadowMap } from '../ShadowMap';
import { AMaterial } from './Material';

export class ShadowOnlyMaterial extends AMaterial<ShadowOnlyShaderState> {

  /**
   * 
   * @param renderer renderer 
   * @param texture Cubemap texture
   */
  constructor(renderer: GLRenderer, protected _shadowMap: ShadowMap) {
    super();
    
    this._shaderState = renderer.getShader(ShadowOnlyShaderID).createState() as ShadowOnlyShaderState;
    // this._shaderState.lightDirection = _shadowMap.getRawLookAt();

    // shadowMap.depthTexture.active(GLDefaultTextureLocation.SHADOW_MAP_0 + shadowIndex);

  }

  lightDirection = vec3.create();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void {
    const ss = this._shaderState;
    ss.use();
    cam.mvp(ss.mvpMat, transformMat);
    cam.normalMat(ss.normalMat, transformMat);
    // ss.lightDirection = this.lightDirection;
    
    vec3.negate(ss.lightDirection, this._shadowMap.getRawLookAt());
    // vec3.copy(ss.lightDirection, this._shadowMap.getRawLookAt());

    this._shadowMap.depthBiasMvp(ss.depthBiasMvpMat,transformMat);
    this._shadowMap.depthTexture.active(GLDefaultTextureLocation.SHADOW_MAP_0);
    ss.syncUniforms();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(gl: AnyWebRenderingGLContext): void {}
}
