import { vec3 } from 'gl-matrix';
import { getDefaultAttributeLocation, setDefaultTextureLocationForVariantShader } from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../tsgl/gl/core/GLHelpers';
import { GLRenderer } from '../../tsgl/gl/core/GLRenderer';
import { GLShaderVariantDeclinaison } from '../../tsgl/gl/core/shader/variants/GLShaderVariantDeclinaison';
import { GLShaderVariants } from '../../tsgl/gl/core/shader/variants/GLShaderVariants';
import { GLVariantValueDefinition } from '../../tsgl/gl/core/shader/variants/GLVariantShaderTypes';
import { PhongBlinnDeferredVShadersState } from './PhongBlinnDeferredVShadersState';


export interface PhongBlinnDeferredLightInterface {
  direction: vec3;
  color: vec3;
  specularColor: vec3;
  ambiantColor: vec3;
  shininess: number;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/phongBlinnDeferred.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/phongBlinnDeferred.vert').default;

export type PhongBlinnDeferredVariant = {
  normal: 'vertex' | 'map';
};

export const PhongBlinnDeferredVShaderID = 'phong_blinn_deferred_variant';

export enum PhongBlinnDeferredShaderDebug {
  none = 'none',
  normal = 'normal',
  diffuse = 'diffuse',
  specular = 'specular',
  ambiant = 'ambiant',
  occlusion = 'occlusion',
  shadow = 'shadow',
}

export class PhongBlinnDeferredVShader extends GLShaderVariants<
  PhongBlinnDeferredVShadersState,
  PhongBlinnDeferredVariant
> {
  constructor(gl: AnyWebRenderingGLContext) {
    const valueDefTest: { [name: string]: GLVariantValueDefinition[] } = {
      debug: [
        {
          value: PhongBlinnDeferredShaderDebug.none,
          default: true,
          flags: {},
        },
        {
          value: PhongBlinnDeferredShaderDebug.normal,
          flags: {
            DEBUG: true,
            DEBUG_NORMAL: true,
          },
        },
        {
          value: PhongBlinnDeferredShaderDebug.diffuse,
          flags: {
            DEBUG: true,
            DEBUG_LIGHT_DIFFUSE_SPEC: true,
            DEBUG_LIGHT_DIFFUSE: true,
          },
        },
        {
          value: PhongBlinnDeferredShaderDebug.specular,
          flags: {
            DEBUG: true,
            DEBUG_LIGHT_DIFFUSE_SPEC: true,
            DEBUG_LIGHT_SPECULAR: true,
          },
        },
        {
          value: PhongBlinnDeferredShaderDebug.ambiant,
          flags: {
            DEBUG: true,
            DEBUG_LIGHT_AMBIANT: true,
          },
        },
        {
          value: PhongBlinnDeferredShaderDebug.occlusion,
          flags: {
            DEBUG: true,
            DEBUG_OCCLUSION: true,
          },
        },
        {
          value: PhongBlinnDeferredShaderDebug.shadow,
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
    };

    super(
      gl,
      vertSrc,
      fragSrc,
      PhongBlinnDeferredVShadersState,
      valueDefTest,
      getDefaultAttributeLocation(['a_position', 'a_uv']),
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
      'u_positionMap',
      'u_depthMap',
      'u_irradianceMap',
      'u_pbrMap',
      'u_shadowMap',
    ]);
  }

  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      PhongBlinnDeferredVShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new PhongBlinnDeferredVShader(gl),
    );
  }
}
