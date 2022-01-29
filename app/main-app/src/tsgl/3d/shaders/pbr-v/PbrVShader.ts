
import { GLShaderVariants, AnyWebRenderingGLContext, GLVariantValueDefinition, getDefaultAttributeLocation, IGLTexture, GLDefaultTextureLocation, GLShaderVariantDeclinaison, setDefaultTextureLocationForVariantShader, GLRenderer } from '@tsgl/gl';
import { PbrVShadersState } from './PbrVShadersState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./pbr.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./pbr.vert').default;

export type PbrVariant = {
  normal: 'vertex' | 'map';
};

export const PbrVShaderID = 'pbr_variant';

export type PbrShaderDebug =
  | 'none'
  | 'normal'
  | 'diffuse'
  | 'specular'
  | 'ambiant'
  | 'occlusion'
  | 'roughness'
  | 'metallic'
  | 'shadow'
  | 'emissive';

export class PbrVShader extends GLShaderVariants<PbrVShadersState, PbrVariant> {
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

      occlusion: [
        {
          value: 'on',
          flags: {
            OCCLUSION_MAP: true,
            OCCLUSION_ONLY: true,
          },
        },
        {
          value: 'pbr',
          flags: {
            OCCLUSION_MAP: true,
            OCCLUSION_PBR: true,
          },
        },
        {
          value: 'off',
          default: true,
          flags: {
            DISABLE_OCCLUSION_MAP: false,
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
      getDefaultAttributeLocation(['a_position', 'a_normal', 'a_uv', 'a_tangent']),
    );

    this._ludLoaded = false;

    // if(BOOSTRAP_BUILD_MODE === false){
    //   setDefaultTextureLocationForAllShaderVariants(this, ['u_textureMap', 'u_normalMap', 'u_irradianceMap', 'u_pbrMap']);
    // }
  }

  get lutLoaded(): boolean {
    return this._ludLoaded;
  }

  activeBrdfLutTexture(brdfLut: IGLTexture): void {
    brdfLut.activeSafe(GLDefaultTextureLocation.RELEXION_LUT);
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
      'u_emissiveMap',
      'u_shadowMap',
      'u_occlusionMap',
    ]);
  }

  static register(renderer: GLRenderer, brdfLut?: IGLTexture): void {
    renderer.registerShaderFactoryFunction(
      PbrVShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => {
        const shader = new PbrVShader(gl);
        if (brdfLut) shader.activeBrdfLutTexture(brdfLut);
        return shader;
      },
    );
  }
}
