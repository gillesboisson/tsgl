import { AnyWebRenderingGLContext } from '../GLHelpers';
import { GLShader } from '../shader/GLShader';
import { IGLShaderState } from '../shader/IGLShaderState';
import { GLShaderVariantDeclinaison } from '../shader/variants/GLShaderVariantDeclinaison';
import { GLShaderVariants } from '../shader/variants/GLShaderVariants';

export enum GLDefaultAttributesLocation {
  POSITION = 0,
  UV = 1,
  UV2 = 2,
  NORMAL = 3,
  COLOR = 4,
  TANGENT = 5,
  JOINT = 6,
  WEIGHT = 7,
  IPOSITION = 10,
  IVELOCITY = 11,
  IORIENTATION = 12,
  ICOLOR = 13,
  ISCALE = 14,
}

const defaultAttributes: { [name: string]: number } = {
  // deprecated attributes name
  position: GLDefaultAttributesLocation.POSITION,
  uv: GLDefaultAttributesLocation.UV,
  uv2: GLDefaultAttributesLocation.UV2,
  normal: GLDefaultAttributesLocation.NORMAL,
  color: GLDefaultAttributesLocation.COLOR,
  tangent: GLDefaultAttributesLocation.TANGENT,
  joint: GLDefaultAttributesLocation.JOINT,
  weight: GLDefaultAttributesLocation.WEIGHT,
  iposition: GLDefaultAttributesLocation.IPOSITION,
  iorientation: GLDefaultAttributesLocation.IORIENTATION,
  ivelocity: GLDefaultAttributesLocation.IVELOCITY,
  icolor: GLDefaultAttributesLocation.ICOLOR,
  iscale: GLDefaultAttributesLocation.ISCALE,

  a_position: GLDefaultAttributesLocation.POSITION,
  a_uv: GLDefaultAttributesLocation.UV,
  a_uv2: GLDefaultAttributesLocation.UV2,
  a_normal: GLDefaultAttributesLocation.NORMAL,
  a_color: GLDefaultAttributesLocation.COLOR,
  a_tangent: GLDefaultAttributesLocation.TANGENT,
  a_joint: GLDefaultAttributesLocation.JOINT,
  a_weight: GLDefaultAttributesLocation.WEIGHT,
  a_iposition: GLDefaultAttributesLocation.IPOSITION,
  a_iorientation: GLDefaultAttributesLocation.IORIENTATION,
  a_ivelocity: GLDefaultAttributesLocation.IVELOCITY,
  a_icolor: GLDefaultAttributesLocation.ICOLOR,
  a_iscale: GLDefaultAttributesLocation.ISCALE,
};

export function getDefaultAttributeLocation(only?: string[]): { [name: string]: number } {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const res = only === undefined ? defaultAttributes : {};
  if (only === undefined) {
    return defaultAttributes;
  } else {
    const res: { [name: string]: number } = {};
    for (const attrName of only) {
      res[attrName] = defaultAttributes[attrName];
    }

    return res;
  }
}

export enum GLDefaultTextureLocation {
  COLOR = 0,
  NORMAL = 1,
  POSITION = 2,
  DEPTH = 3,

  PBR_0 = 4,
  PBR_1 = 5,
  PBR_2 = 6,
  AMBIANT_OCCLUSION = 7,

  PLANAR_REFLECTION = 10,
  SKYBOX = 11,
  IRRADIANCE_BOX = 12,
  SHADOW_MAP_0 = 15,
  SHADOW_MAP_1 = 16,
  SHADOW_MAP_2 = 17,

  POST_PROCESS_0 = 20,
  POST_PROCESS_1 = 21,
  POST_PROCESS_2 = 22,
  POST_PROCESS_3 = 23,
  POST_PROCESS_4 = 24,
}

const defaultTextureLocation: { [name: string]: GLDefaultTextureLocation } = {
  u_texture: GLDefaultTextureLocation.COLOR,
  u_diffuseMap: GLDefaultTextureLocation.COLOR,
  u_normalMap: GLDefaultTextureLocation.NORMAL,
  u_skyboxMap: GLDefaultTextureLocation.SKYBOX,
  u_pbrMap: GLDefaultTextureLocation.PBR_0,
  u_irradianceMap: GLDefaultTextureLocation.IRRADIANCE_BOX,
  u_shadowMap: GLDefaultTextureLocation.SHADOW_MAP_0,
  u_shadowMap0: GLDefaultTextureLocation.SHADOW_MAP_0,
  u_shadowMap1: GLDefaultTextureLocation.SHADOW_MAP_1,
  u_shadowMap2: GLDefaultTextureLocation.SHADOW_MAP_2,
};

export function setDefaultTextureLocation(
  shader: GLShader<IGLShaderState>,
  only?: string[],
): { [name: string]: GLDefaultTextureLocation } {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const res: { [name: string]: GLDefaultTextureLocation } = {};
  if (only === undefined) only = Object.keys(defaultTextureLocation);

  const uniformsLocations = shader.getUniformsLocations();
  shader.use();
  const gl = shader.gl;

  only.forEach((name) => {
    const location = defaultTextureLocation[name];

    if (location === undefined) throw new Error('no default texture location for ' + name);

    const uniformLocation = uniformsLocations[name];

    if (uniformLocation === undefined) {
      console.warn('No uniform location for ' + name);
    }
    gl.uniform1i(uniformLocation, location);

    res[name] = location;
  });
  return res;
}

export function setDefaultTextureLocationForVariantShader(shaderD: GLShaderVariantDeclinaison, only?: string[]): void {
  const uniformsLocations = shaderD.uniformsLocation;

  const gl = shaderD.gl;
  if (only === undefined) only = Object.keys(defaultTextureLocation);

  gl.useProgram(shaderD.program);
  only.forEach((name) => {
    const location = defaultTextureLocation[name];

    if (location === undefined) return;

    const uniformLocation = uniformsLocations[name];

    gl.uniform1i(uniformLocation, location);
  });
}

export function setDefaultTextureLocationForAllVariantShader(
  shaderVariants: GLShaderVariants<IGLShaderState, any>,
  only?: string[],
): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  if (only === undefined) only = Object.keys(defaultTextureLocation);

  const shaders = shaderVariants.shaders;

  Object.keys(shaders).forEach((slug) => {
    const shaderD = shaders[slug];
    const uniformsLocations = shaderD.uniformsLocation;

    const gl = shaderD.gl;

    gl.useProgram(shaderD.program);
    only.forEach((name) => {
      const location = defaultTextureLocation[name];

      if (location === undefined) return;

      const uniformLocation = uniformsLocations[name];

      gl.uniform1i(uniformLocation, location);

    });
  });
}
