import { vec3 } from 'gl-matrix';
import { GLShaderVariants, AnyWebRenderingGLContext, GLVariantValueDefinition, getDefaultAttributeLocation, GLShaderVariantDeclinaison, setDefaultTextureLocationForVariantShader, GLRenderer } from '@tsgl/gl';

import { PhongBlinnCartoonVShaderState } from './PhongBlinnCartoonVShaderState';

export interface PhongBlinnCartoonLightInterface {
  direction: vec3;
  color: vec3;
  specularColor: vec3;
  ambiantColor: vec3;
  shininess: number;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./phongBlinnCartoon.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./phongBlinnCartoon.vert').default;

export type PhongBlinnCartoonVariant = {
  normal: 'vertex' | 'map';
};

export const PhongBlinnCartoonVShaderID = 'phong_blinn_cartoon_variant';

export enum PhongBlinnCartoonShaderDebug{
  none =  'none',
  normal =  'normal',
  diffuse =  'diffuse',
  specular =  'specular',
  ambiant =  'ambiant',
  occlusion =  'occlusion',
  shadow =  'shadow',
}

export class PhongBlinnCartoonVShader extends GLShaderVariants<PhongBlinnCartoonVShaderState, PhongBlinnCartoonVariant> {
  constructor(gl: AnyWebRenderingGLContext) {
    const valueDefTest: { [name: string]: GLVariantValueDefinition[] } = {
      debug: [
        {
          value: PhongBlinnCartoonShaderDebug.none,
          default: true,
          flags: {},
        },
        {
          value: PhongBlinnCartoonShaderDebug.normal,
          flags: {
            DEBUG: true,
            DEBUG_NORMAL: true, 
          },
        },
        {
          value: PhongBlinnCartoonShaderDebug.diffuse,
          flags: {
            DEBUG: true,
            DEBUG_LIGHT_DIFFUSE_SPEC: true,
            DEBUG_LIGHT_DIFFUSE: true, 
          },
        },
        {
          value: PhongBlinnCartoonShaderDebug.specular,
          flags: {
            DEBUG: true,
            DEBUG_LIGHT_DIFFUSE_SPEC: true,
            DEBUG_LIGHT_SPECULAR: true, 
          },
        },
        {
          value: PhongBlinnCartoonShaderDebug.ambiant,
          flags: {
            DEBUG: true,
            DEBUG_LIGHT_AMBIANT: true,
          },
        },
        {
          value: PhongBlinnCartoonShaderDebug.occlusion,
          flags: {
            DEBUG: true,
            DEBUG_OCCLUSION: true,
          },
        },
        {
          value: PhongBlinnCartoonShaderDebug.shadow,
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
            SHADOW_MAP: true
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
      diffuse:[
        {
          value: 'color',
          default: true,
          flags: {
            DIFFUSE_COLOR: true,
          }
        },
        {
          value: 'texture',
          
          flags: {
            DIFFUSE_MAP: true,
          }
        }
      ]
    };

    super(
      gl,
      vertSrc,
      fragSrc,
      PhongBlinnCartoonVShaderState,
      valueDefTest,
      getDefaultAttributeLocation(['a_position', 'a_normal', 'a_uv','a_tangent']),
    );
    
    // if(BOOSTRAP_BUILD_MODE === false){
    //   setDefaultTextureLocationForAllShaderVariants(this, ['u_textureMap', 'u_normalMap', 'u_irradianceMap', 'u_pbrMap']);
    // }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  programBuilt(declinaison: GLShaderVariantDeclinaison,program: WebGLProgram): void{
    setDefaultTextureLocationForVariantShader(declinaison,  ['u_textureMap', 'u_normalMap', 'u_irradianceMap', 'u_pbrMap','u_shadowMap']);
  }

  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      PhongBlinnCartoonVShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new PhongBlinnCartoonVShader(gl),
    );
  }
}


