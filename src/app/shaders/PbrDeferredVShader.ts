import { vec3 } from 'gl-matrix';
import { getDefaultAttributeLocation, GLDefaultTextureLocation, setDefaultTextureLocationForVariantShader } from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../tsgl/gl/core/GLHelpers';
import { GLRenderer } from '../../tsgl/gl/core/GLRenderer';
import { GLShaderVariantDeclinaison } from '../../tsgl/gl/core/shader/variants/GLShaderVariantDeclinaison';
import { GLShaderVariants } from '../../tsgl/gl/core/shader/variants/GLShaderVariants';
import { GLVariantValueDefinition } from '../../tsgl/gl/core/shader/variants/GLVariantShaderTypes';
import { IGLTexture } from '../../tsgl/gl/core/texture/GLTexture';
import { PbrDeferredVShadersState } from './PbrDeferredVShadersState';


export interface PbrDeferredLightInterface {
  direction: vec3;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/pbrDeferred.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/pbrDeferred.vert').default;

export type PbrDeferredVariant = {
  normal: 'vertex' | 'map';
};

export const PbrDeferredVShaderID = 'pbr_deferred_variant';

export enum PbrDeferredShaderDebug {
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

export class PbrDeferredVShader extends GLShaderVariants<
  PbrDeferredVShadersState,
  PbrDeferredVariant
> {
  protected _ludLoaded: boolean;

  constructor(gl: AnyWebRenderingGLContext) {
    const valueDefTest: { [name: string]: GLVariantValueDefinition[] } = {
      debug: [
        {
          value: PbrDeferredShaderDebug.none,
          default: true,
          flags: {},
        },
        {
          value: PbrDeferredShaderDebug.normal,
          flags: {
            DEBUG: true,
            DEBUG_NORMAL: true,
          },
        },
        {
          value: PbrDeferredShaderDebug.diffuse,
          flags: {
            DEBUG: true,
            DEBUG_DIFFUSE: true,
          },
        },
        {
          value: PbrDeferredShaderDebug.specular,
          flags: {
            DEBUG: true,
            DEBUG_SPECULAR: true,
          },
        },
        {
          value: PbrDeferredShaderDebug.ambiant,
          flags: {
            DEBUG: true,
            DEBUG_AMBIANT: true,
          },
        },
        {
          value: PbrDeferredShaderDebug.occlusion,
          flags: {
            DEBUG: true,
            DEBUG_OCCLUSION: true,
          },
        },
        {
          value: PbrDeferredShaderDebug.metallic,
          flags: {
            DEBUG: true,
            DEBUG_METALLIC: true,
          },
        },
        {
          value: PbrDeferredShaderDebug.roughness,
          flags: {
            DEBUG: true,
            DEBUG_ROUGHNESS: true,
          },
        },
        {
          value: PbrDeferredShaderDebug.shadow,
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
          default: true,
          flags: {
            SHADOW_MAP: true,
          },
        },
      ],
      emissiveMap: [
        {
          value: true,
          flags: {
            EMISSIVE_MAP: true,
          },
        },
        {
          value: false,
          default: true,
          flags: {
            EMISSIVE_MAP_DISABLED: true,
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
      occlusion: [
        {
          value: 'on',
          flags: {
            OCCLUSION_MAP: true,
            OCCLUSION_ENABLED: true,
          },
        },

        {
          value: 'off',
          default: true,
          flags: {
            OCCLUSION_DISABLED: false,
          },
        },
      ],
      
    };

    super(
      gl,
      vertSrc,
      fragSrc,
      PbrDeferredVShadersState,
      valueDefTest,
      getDefaultAttributeLocation(['a_position', 'a_uv']),
    );

    this._ludLoaded = false;


    // if(BOOSTRAP_BUILD_MODE === false){
    //   setDefaultTextureLocationForAllShaderVariants(this, ['u_textureMap', 'u_normalMap', 'u_irradianceMap', 'u_pbrMap']);
    // }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  programBuilt(declinaison: GLShaderVariantDeclinaison, program: WebGLProgram): void {
    setDefaultTextureLocationForVariantShader(declinaison, [
      'u_textureMap',
      'u_normalMap',
      'u_positionMap',
      'u_depthMap',
      'u_irradianceMap',
      'u_reflexionMap',
      'u_brdfLut',
      'u_emissiveMap',
      'u_pbrMap',
      'u_shadowMap',
    ]);
  }

  get lutLoaded(): boolean {
    return this._ludLoaded;
  }
  
  activeBrdfLutTexture(brdfLut: IGLTexture): void {
    brdfLut.activeSafe(GLDefaultTextureLocation.RELEXION_LUT);
    this._ludLoaded = true;
  }

  static register(renderer: GLRenderer, brdfLut?: IGLTexture): void {
    renderer.registerShaderFactoryFunction(
      PbrDeferredVShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => {
        const shader = new PbrDeferredVShader(gl);
        if (brdfLut) shader.activeBrdfLutTexture(brdfLut);
        return shader;
      }
    );
  }
}
