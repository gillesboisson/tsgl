import { mat4, vec3 } from 'gl-matrix';
import { GLDefaultTextureLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { IGLTexture } from '../../gl/core/texture/GLTexture';
import { SimplePBRShaderID, SimplePBRShaderState } from '../../shaders/SimplePBRShader';
import { Camera } from '../../utils';
import { AMaterial } from './Material';

export interface SimplePBRLightInterface {
  direction: vec3;
  color: vec3;
}

export class SimplePBRMaterial extends AMaterial<SimplePBRShaderState> {
  constructor(
    renderer: GLRenderer,
    readonly light: SimplePBRLightInterface,
    readonly irradianceMap: IGLTexture,
    readonly reflectionMap: IGLTexture,
  ) {
    super();

    this._shaderState = renderer.getShader(SimplePBRShaderID).createState() as SimplePBRShaderState;
  }

  color = vec3.fromValues(1, 1, 1);

  metallic = 0;
  roughness = 0;
  ao = 1;

  brdfLUT: IGLTexture;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void {
    const light = this.light;

    const ss = this._shaderState;
    ss.use();

    cam.mvp(ss.mvpMat, transformMat);
    cam.normalMat(ss.normalMat, transformMat);
    ss.modelMat = transformMat;

    ss.lightDirection = light.direction;
    ss.lightColor = light.color;

    ss.albedo = this.color;
    ss.metallic = this.metallic;

    // apply base mapping
    ss.roughness = this.roughness * 0.999;
    // ss.roughness = (this.roughness + 1) * (this.roughness + 1) / 8;
    // ss.roughness = this.roughness * this.roughness  / 2;
    ss.ao = this.ao;

    vec3.copy(ss.cameraPosition, cam.transform.getRawPosition());

    if (this.irradianceMap) {
      this.irradianceMap.active(GLDefaultTextureLocation.IRRADIANCE_BOX);
    }

    if (this.reflectionMap) {
      this.reflectionMap.active(GLDefaultTextureLocation.RELEXION_BOX);
    }
    if (this.brdfLUT) {
      this.brdfLUT.active(GLDefaultTextureLocation.RELEXION_LUT);
    }

    ss.syncUniforms();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(gl: AnyWebRenderingGLContext): void {}
}
