import { mat4, vec3, vec4 } from 'gl-matrix';
import { Camera } from '../../3d/Camera';
import { AMaterial } from '../../3d/Material/Material';
import { GLDefaultTextureLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { GLTexture } from '../../gl/core/GLTexture';
import { PhongBlinnShaderID, PhongBlinnShaderState } from '../../shaders/PhongBlinnShader';

export interface PhongBlinnLightInterface {
  position: vec3;
  color: vec3;
  specularColor: vec3;
  ambiantColor: vec3;
  shininess: number;
}

export class PhongBlinnMaterial extends AMaterial<PhongBlinnShaderState> {
  constructor(renderer: GLRenderer, public texture: GLTexture, public light: PhongBlinnLightInterface) {
    super();

    this._shaderState = renderer.getShader(PhongBlinnShaderID).createState() as PhongBlinnShaderState;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void {
    const ss = this._shaderState;
    const light = this.light;
    ss.use();

    // light
    ss.lightPosition = light.position;
    ss.lightColor = light.color;
    ss.specularColor = light.specularColor;
    ss.ambiantColor = light.ambiantColor;
    ss.lightShininess = light.shininess;

    cam.mvp(ss.mvpMat, transformMat);
    cam.normalMat(ss.normalMat, transformMat);
    ss.modelMat = transformMat;
    vec3.negate(ss.cameraPosition, cam.transform.getRawPosition()); 

    this.texture.active(GLDefaultTextureLocation.COLOR);

    ss.syncUniforms();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(gl: AnyWebRenderingGLContext): void {
    this.texture.unbind();
  }
}
