import { vec3 } from 'gl-matrix';
import {
  getDefaultAttributeLocation,
  setDefaultTextureLocationForVariantShader,
} from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../tsgl/gl/core/GLHelpers';
import { GLRenderer } from '../../tsgl/gl/core/GLRenderer';
import { GLShaderVariantDeclinaison } from '../../tsgl/gl/core/shader/variants/GLShaderVariantDeclinaison';
import { GLShaderVariants } from '../../tsgl/gl/core/shader/variants/GLShaderVariants';
import { GLVariantValueDefinition } from '../../tsgl/gl/core/shader/variants/GLVariantShaderTypes';
import { DeferredPrepassVShadersState } from './DeferredPrepassVShadersState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/deferredPrepass.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/deferredPrepass.vert').default;

export type DeferredPrepassVariant = {
  normal: 'vertex' | 'map';
};

export const DeferredPrepassVShaderID = 'deferred_prepass';

export class DeferredPrepassVShader extends GLShaderVariants<DeferredPrepassVShadersState, DeferredPrepassVariant> {
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
      // PBR
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
      pbr: [
        {
          value: 'map',
          flags: {
            PBR_MAP: true,
            PBR_ENABLED: true,
          },
        },
        {
          value: 'val',
         
          flags: {
            PBR_VAL: true,
            PBR_ENABLED: true,
          },
        },
        {
          value: 'off',
          default: true,
          flags: {
            PBR_DISABLED: true,

          },
        }
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
    };

    super(
      gl,
      vertSrc,
      fragSrc,
      DeferredPrepassVShadersState,
      valueDefTest,
      getDefaultAttributeLocation(['a_position', 'a_normal', 'a_uv', 'a_tangent']),
    );

    // if(BOOSTRAP_BUILD_MODE === false){
    //   setDefaultTextureLocationForAllShaderVariants(this, ['u_textureMap', 'u_normalMap', 'u_irradianceMap', 'u_pbrMap']);
    // }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  programBuilt(declinaison: GLShaderVariantDeclinaison, program: WebGLProgram): void {
    setDefaultTextureLocationForVariantShader(declinaison, [
      'u_textureMap',
      'u_normalMap',
    ]);
  }

  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      DeferredPrepassVShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new DeferredPrepassVShader(gl),
    );
  }
}
