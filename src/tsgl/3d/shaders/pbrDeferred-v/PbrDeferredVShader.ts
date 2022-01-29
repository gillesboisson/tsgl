import { vec3 } from 'gl-matrix';
import { GLShaderVariants, AnyWebRenderingGLContext, GLVariantValueDefinition, getDefaultAttributeLocation, GLShaderVariantDeclinaison, setDefaultTextureLocationForVariantShader, IGLTexture, GLDefaultTextureLocation, GLRenderer } from '../../../../tsgl/gl';

import { PbrDeferredVShadersState } from './PbrDeferredVShadersState';


export interface PbrDeferredLightInterface {
  direction: vec3;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./pbrDeferred.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./pbrDeferred.vert').default;

export type PbrDeferredVariant = {
  normal: 'vertex' | 'map';
};

export const PbrDeferredVShaderID = 'pbr_deferred_variant';

export class PbrDeferredVShader extends GLShaderVariants<
  PbrDeferredVShadersState,
  PbrDeferredVariant
> {
  protected _ludLoaded: boolean;

  constructor(gl: AnyWebRenderingGLContext) {
    const valueDefTest: { [name: string]: GLVariantValueDefinition[] } = {
      debug: [
        {
          value: 'none',
          default: true,
          flags: {},
        },
        {
          value: 'normal',
          flags: {
            DEBUG: true,
            DEBUG_NORMAL: true,
          },
        },
        {
          value: 'diffuse',
          flags: {
            DEBUG: true,
            DEBUG_DIFFUSE: true,
          },
        },
        {
          value: 'specular',
          flags: {
            DEBUG: true,
            DEBUG_SPECULAR: true,
          },
        },
        {
          value: 'ambiant',
          flags: {
            DEBUG: true,
            DEBUG_AMBIANT: true,
          },
        },
        {
          value: 'occlusion',
          flags: {
            DEBUG: true,
            DEBUG_OCCLUSION: true,
          },
        },
        {
          value: 'metallic',
          flags: {
            DEBUG: true,
            DEBUG_METALLIC: true,
          },
        },
        {
          value: 'roughness',
          flags: {
            DEBUG: true,
            DEBUG_ROUGHNESS: true,
          },
        },
        {
          value: 'shadow',
          flags: {
            DEBUG: true,
            DEBUG_SHADOW: true,
          },
        },
        {
          value: 'emissive',
          flags: {
            DEBUG: true,
            DEBUG_EMISSIVE: true,
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
          value: 'pbr',
          flags: {
            OCCLUSION_ENABLED: true,
            OCCLUSION_PBR: true,
          },
        },

        {
          value: 'ssao',
          flags: {
            OCCLUSION_ENABLED: true,
            OCCLUSION_SSAO: true,
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
      'u_occlusionMap',
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
