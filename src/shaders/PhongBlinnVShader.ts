import { mat4, vec3, vec4 } from 'gl-matrix';
import { Camera } from '../3d/Camera';
import { AMaterial } from '../3d/Material/Material';
import { PhongBlinnLightInterface } from '../app/materials/BlinnPhongMaterial';
import { getDefaultAttributeLocation, GLDefaultTextureLocation, setDefaultTextureLocationForAllVariantShader } from '../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLRenderer } from '../gl/core/GLRenderer';
import { GLTexture } from '../gl/core/GLTexture';
import { GLShaderVariants } from '../gl/core/shader/variants/GLShaderVariants';
import { GLVariantValueDefinition } from '../gl/core/shader/variants/GLVariantShaderTypes';
import { ShaderVariantsState } from '../gl/core/shader/variants/ShaderVariantsState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/phongBlinn.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/phongBlinn.vert').default;

class PhongBlinnVShadersState extends ShaderVariantsState<PhongBlinnVariant> {


  modelMat: mat4 = mat4.create();
  mvpMat: mat4 = mat4.create();
  normalMat: mat4 = mat4.create();

  cameraPosition: vec3 = vec3.create();
  
  lightPosition: vec3 = vec3.create();
  lightColor: vec3 = vec3.create();
  specularColor: vec3 = vec3.create();
  lightShininess: number;

  ambiantColor: vec3 = vec3.create();
  

  syncUniforms(): void {
    const uniformsLocations = this._variantShader.uniformsLocation;
    const gl = this.gl;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvpMat);
    gl.uniformMatrix4fv(uniformsLocations.u_normalMat, false, this.normalMat);
    gl.uniformMatrix4fv(uniformsLocations.u_modelMat, false, this.modelMat);

    

    gl.uniform3fv(uniformsLocations.u_cameraPosition, this.cameraPosition);

    gl.uniform3fv(uniformsLocations.u_lightPosition, this.lightPosition);
    gl.uniform3fv(uniformsLocations.u_lightColor, this.lightColor);
    gl.uniform3fv(uniformsLocations.u_specularColor, this.specularColor);
    gl.uniform3fv(uniformsLocations.u_ambiantColor, this.ambiantColor);

    gl.uniform1f(uniformsLocations.u_lightShininess, this.lightShininess);
  }
}

type PhongBlinnVariant = {
  normal: 'vertex' | 'map' ;
};

export const PhongBlinnVShaderID = 'phong_blinn_variant';

export class PhongBlinnVShader extends GLShaderVariants<PhongBlinnVShadersState, PhongBlinnVariant> {
  constructor(gl: AnyWebRenderingGLContext) {
    const valueDefTest: { [name: string]: GLVariantValueDefinition[] } = {
      normal: [
        {
          value: 'vertex',
          default: true,
          flags: {
            NORMAL_VERTEX: true,
          },
        },
        {
          value: 'map',
          
          flags: {
            NORMAL_MAP: true,
          },
        },
      ],
    };

    super(
      gl,
      vertSrc,
      fragSrc,
      PhongBlinnVShadersState,
      valueDefTest,
      getDefaultAttributeLocation(['a_position', 'a_normal', 'a_uv']),
    );


    setDefaultTextureLocationForAllVariantShader(this,['u_textureMap','u_normalMap']);
  }

  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      PhongBlinnVShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new PhongBlinnVShader(gl),
    );
  }
}

export class PhongBlinnVMaterial extends AMaterial<PhongBlinnVShadersState> {
  constructor(renderer: GLRenderer, public texture: GLTexture, public light: PhongBlinnLightInterface) {
    super();

    this._shaderState = renderer.getShader(PhongBlinnVShaderID).createState() as PhongBlinnVShadersState;
  }


  protected _normalMap: GLTexture;

  get normalMap(): GLTexture{
    return this._normalMap;
  }

  set normalMap(val: GLTexture){
    if(val !== this._normalMap){
      this._normalMap = val;
      this._shaderState?.setVariantValue('normal', val ? 'map' : 'vertex');
    }
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

    if(this._normalMap){
      this._normalMap.active(GLDefaultTextureLocation.NORMAL);

    }

    ss.syncUniforms();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(gl: AnyWebRenderingGLContext): void {}
}
