import { mat4, vec3, vec4 } from 'gl-matrix';
import { Camera } from '../3d/Camera';
import { AMaterial } from '../3d/Material/Material';
import {
  getDefaultAttributeLocation,
  GLDefaultTextureLocation,
  setDefaultTextureLocationForAllVariantShader as setDefaultTextureLocationForAllShaderVariants,
} from '../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLRenderer } from '../gl/core/GLRenderer';
import { GLTexture } from '../gl/core/GLTexture';
import { GLShaderVariants } from '../gl/core/shader/variants/GLShaderVariants';
import { GLVariantValueDefinition } from '../gl/core/shader/variants/GLVariantShaderTypes';
import { ShaderVariantsState } from '../gl/core/shader/variants/ShaderVariantsState';

export interface PhongBlinnLightInterface {
  direction: vec3;
  color: vec3;
  specularColor: vec3;
  ambiantColor: vec3;
  shininess: number;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/phongBlinn.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/phongBlinn.vert').default;

class PhongBlinnVShadersState extends ShaderVariantsState<PhongBlinnVariant> {
  modelMat: mat4 = mat4.create();
  mvpMat: mat4 = mat4.create();
  normalMat: mat4 = mat4.create();

  cameraPosition: vec3 = vec3.create();

  lightDirection: vec3 = vec3.create();
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

    gl.uniform3fv(uniformsLocations.u_lightDirection, this.lightDirection);
    gl.uniform3fv(uniformsLocations.u_lightColor, this.lightColor);
    gl.uniform3fv(uniformsLocations.u_specularColor, this.specularColor);

    gl.uniform3fv(uniformsLocations.u_ambiantColor, this.ambiantColor);

    gl.uniform1f(uniformsLocations.u_lightShininess, this.lightShininess);
  }
}

type PhongBlinnVariant = {
  normal: 'vertex' | 'map';
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
        {
          value: 'tbn',

          flags: {
            NORMAL_TBN: true,
          },
        },
      ],
      ambiant: [
        {
          value: 'color',
          default: true,
          flags: {
            AMBIANT_COLOR: true,
          },
        },
        {
          value: 'irradiance',
          default: true,
          flags: {
            AMBIANT_IRRADIANCE: true,
          },
        },
      ],
      occlusionMap: [
        {
          value: true,
          flags: {
            OCCLUSION_PBR_SPEC_MAP: true,
            OCCLUSION_MAP: true,
          },
        },
        {
          value: false,
          default: true,
          flags: {
            OCCLUSION_PBR_SPEC_MAP: false,
            OCCLUSION_MAP: false,
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
      getDefaultAttributeLocation(['a_position', 'a_normal', 'a_uv','a_tangent']),
    );

    setDefaultTextureLocationForAllShaderVariants(this, ['u_textureMap', 'u_normalMap', 'u_irradianceMap', 'u_pbrMap']);
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
  protected _irradianceMap: GLTexture;
  protected _extraMap: GLTexture;

  // occlusion map enabled (extra map need to be provided)
  protected _occlusionMapEnabled = false;

  // Tangent, Bilinear tangent, normal enabled (normal map need to be provided)
  protected _tbnEnabled = false;

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

  get extraMap(): GLTexture {
    return this._extraMap;
  }

  set extraMap(val: GLTexture) {
    if (val !== this._extraMap) {
      this._extraMap = val;
      this.updateOcclusionMap();
    }
  }

  get irradianceMap(): GLTexture {
    return this._irradianceMap;
  }

  set irradianceMap(val: GLTexture) {
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

    cam.mvp(ss.mvpMat, transformMat);
    cam.normalMat(ss.normalMat, transformMat);
    ss.modelMat = transformMat;
    vec3.negate(ss.cameraPosition, cam.transform.getRawPosition());

    this.texture.active(GLDefaultTextureLocation.COLOR);

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
  unbind(gl: AnyWebRenderingGLContext): void {}
}
