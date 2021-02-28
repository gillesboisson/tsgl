import { vec3 } from 'gl-matrix';
import {
  getDefaultAttributeLocation,
  GLDefaultTextureLocation,
  setDefaultTextureLocationForVariantShader,
} from '../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLRenderer } from '../gl/core/GLRenderer';
import { GLTexture } from '../gl/core/GLTexture';
import { GLShaderVariantDeclinaison } from '../gl/core/shader/variants/GLShaderVariantDeclinaison';
import { GLShaderVariants } from '../gl/core/shader/variants/GLShaderVariants';
import { GLVariantValueDefinition } from '../gl/core/shader/variants/GLVariantShaderTypes';
import { PbrVShadersState } from './PbrVShadersState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/pbr.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/pbr.vert').default;

export type PbrVariant = {
  normal: 'vertex' | 'map';
};

export const PbrVShaderID = 'pbr_variant';

export enum PbrShaderDebug {
  none = 'none',
  normal = 'normal',
  diffuse = 'diffuse',
  specular = 'specular',
  ambiant = 'ambiant',
  occlusion = 'occlusion',
  roughness = 'roughness',
  metallic = 'metallic',
  shadow = 'shadow',
}

export class PbrVShader extends GLShaderVariants<PbrVShadersState, PbrVariant> {

  protected _ludLoaded: boolean;

  constructor(gl: AnyWebRenderingGLContext) {
    const valueDefTest: { [name: string]: GLVariantValueDefinition[] } = {
      debug: [
        {
          value: PbrShaderDebug.none,
          default: true,
          flags: {},
        },
        {
          value: PbrShaderDebug.normal,
          flags: {
            DEBUG: true,
            DEBUG_NORMAL: true,
          },
        },
        {
          value: PbrShaderDebug.diffuse,
          flags: {
            DEBUG: true,
            DEBUG_DIFFUSE: true,
          },
        },
        {
          value: PbrShaderDebug.specular,
          flags: {
            DEBUG: true,
            DEBUG_SPECULAR: true,
          },
        },
        {
          value: PbrShaderDebug.ambiant,
          flags: {
            DEBUG: true,
            DEBUG_AMBIANT: true,
          },
        },
        {
          value: PbrShaderDebug.occlusion,
          flags: {
            DEBUG: true,
            DEBUG_OCCLUSION: true,
          },
        },
        {
          value: PbrShaderDebug.metallic,
          flags: {
            DEBUG: true,
            DEBUG_METALLIC: true,
          },
        },
        {
          value: PbrShaderDebug.roughness,
          flags: {
            DEBUG: true,
            DEBUG_ROUGHNESS: true,
          },
        },
        {
          value: PbrShaderDebug.shadow,
          flags: {
            DEBUG: true,
            DEBUG_SHADOW: true,
          },
        },
      ],
      shadowMap: [
        {
          value: 'off',
          default: true,
          flags: {},
        },
        {
          value: 'pcf',
          
          flags: {
            SHADOW_MAP: true,
          },
        },
      ],
      gammaCorrection: [
        {
          value: false,
          default: true,
          flags: {},
        },
        {
          value: true,
          flags: {
            GAMMA_CORRECTION: true,
          },
        },
      ],
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
      pbrMap: [
        {
          value: true,
          flags: {
            PBR_MAP: true,
          },
        },
        {
          value: false,
          default: true,
          flags: {
            PBR_VAL: true,
          },
        },
      ],
      diffuse: [
        {
          value: 'color',
          default: true,
          flags: {
            DIFFUSE_COLOR: true,
          },
        },
        {
          value: 'texture',

          flags: {
            DIFFUSE_MAP: true,
          },
        },
      ],
    };

    super(
      gl,
      vertSrc,
      fragSrc,
      PbrVShadersState,
      valueDefTest,
      getDefaultAttributeLocation(['a_position', 'a_normal', 'a_uv', 'a_tangent'])
    );

    this._ludLoaded = false;

    // if(BOOSTRAP_BUILD_MODE === false){
    //   setDefaultTextureLocationForAllShaderVariants(this, ['u_textureMap', 'u_normalMap', 'u_irradianceMap', 'u_pbrMap']);
    // }
  }


  get lutLoaded(): boolean{
    return this._ludLoaded;
  }

  activeBrdfLutTexture(brdfLut: GLTexture): void {
    brdfLut.active(GLDefaultTextureLocation.RELEXION_LUT);
    this._ludLoaded = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  programBuilt(declinaison: GLShaderVariantDeclinaison, program: WebGLProgram): void {
    setDefaultTextureLocationForVariantShader(declinaison, [
      'u_textureMap',
      'u_normalMap',
      'u_irradianceMap',
      'u_reflexionMap',
      'u_brdfLut',
      'u_pbrMap',
      'u_shadowMap',
    ]);
  }

  static register(renderer: GLRenderer, brdfLut?: GLTexture): void {
    renderer.registerShaderFactoryFunction(
      PbrVShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => {
        const shader = new PbrVShader(gl);
        if(brdfLut) shader.activeBrdfLutTexture(brdfLut);
        return shader;
      },
    );
  }
}
