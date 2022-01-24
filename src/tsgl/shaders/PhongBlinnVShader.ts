import { vec3 } from 'gl-matrix';
import {
  getDefaultAttributeLocation,
  setDefaultTextureLocationForVariantShader,
} from '../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLRenderer } from '../gl/core/GLRenderer';
import { GLShaderVariantDeclinaison } from '../gl/core/shader/variants/GLShaderVariantDeclinaison';
import { GLShaderVariants } from '../gl/core/shader/variants/GLShaderVariants';
import { GLVariantValueDefinition } from '../gl/core/shader/variants/GLVariantShaderTypes';
import { PhongBlinnVShadersState } from './PhongBlinnVShadersState';

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

export type PhongBlinnVariant = {
  normal: 'vertex' | 'map';
};

export const PhongBlinnVShaderID = 'phong_blinn_variant';

export enum PhongBlinnShaderDebug {
  none = 'none',
  normal = 'normal',
  diffuse = 'diffuse',
  specular = 'specular',
  ambiant = 'ambiant',
  occlusion = 'occlusion',
  shadow = 'shadow',
}

export class PhongBlinnVShader extends GLShaderVariants<PhongBlinnVShadersState, PhongBlinnVariant> {
  constructor(gl: AnyWebRenderingGLContext) {
    const valueDefTest: { [name: string]: GLVariantValueDefinition[] } = {
      debug: [
        {
          value: PhongBlinnShaderDebug.none,
          default: true,
          flags: {},
        },
        {
          value: PhongBlinnShaderDebug.normal,
          flags: {
            DEBUG: true,
            DEBUG_NORMAL: true,
          },
        },
        {
          value: PhongBlinnShaderDebug.diffuse,
          flags: {
            DEBUG: true,
            DEBUG_LIGHT_DIFFUSE_SPEC: true,
            DEBUG_LIGHT_DIFFUSE: true,
          },
        },
        {
          value: PhongBlinnShaderDebug.specular,
          flags: {
            DEBUG: true,
            DEBUG_LIGHT_DIFFUSE_SPEC: true,
            DEBUG_LIGHT_SPECULAR: true,
          },
        },
        {
          value: PhongBlinnShaderDebug.ambiant,
          flags: {
            DEBUG: true,
            DEBUG_LIGHT_AMBIANT: true,
          },
        },
        {
          value: PhongBlinnShaderDebug.occlusion,
          flags: {
            DEBUG: true,
            DEBUG_OCCLUSION: true,
          },
        },
        {
          value: PhongBlinnShaderDebug.shadow,
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
            // OCCLUSION_PBR_SPEC_MAP: false,
            // OCCLUSION_MAP: false,
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
      PhongBlinnVShadersState,
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
      'u_irradianceMap',
      'u_pbrMap',
      'u_shadowMap',
    ]);
  }

  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      PhongBlinnVShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new PhongBlinnVShader(gl),
    );
  }
}
