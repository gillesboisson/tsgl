import { mat4, vec3 } from 'gl-matrix';
import { GLDefaultTextureLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { GLTexture } from '../../gl/core/GLTexture';
import { SimplePBRShaderID, SimplePBRShaderState } from '../../shaders/SimplePBRShader';
import { Camera } from '../Camera';
import { AMaterial } from './Material';

export interface SimplePBRLightInterface {
  direction: vec3;
  color: vec3;
}

export class SimplePBRMaterial extends AMaterial<SimplePBRShaderState> {
  constructor(renderer: GLRenderer, readonly light: SimplePBRLightInterface) {
    super();

    this._shaderState = renderer.getShader(SimplePBRShaderID).createState() as SimplePBRShaderState;
  }


  color = vec3.fromValues(1,1,1);

  metalic = 0;
  roughness = 0;
  ao = 1;

  irradianceMap: GLTexture;
  refelexionMap: GLTexture;
  

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
    ss.metallic = this.metalic;

    // apply base mapping 
    ss.roughness = this.roughness;
    // ss.roughness = (this.roughness + 1) * (this.roughness + 1) / 8;
    // ss.roughness = this.roughness * this.roughness  / 2;
    ss.ao = this.ao;

    vec3.copy(ss.cameraPosition, cam.transform.getRawPosition());


    if(this.irradianceMap){
      this.irradianceMap.active(GLDefaultTextureLocation.IRRADIANCE_BOX);
    }

    if(this.refelexionMap){
      this.refelexionMap.active(GLDefaultTextureLocation.RELEXION_BOX);
    }

    
    ss.syncUniforms();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(gl: AnyWebRenderingGLContext): void {
  }
}
