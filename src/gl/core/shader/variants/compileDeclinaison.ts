import { AnyWebRenderingGLContext } from '../../GLHelpers';
import { compileProgram } from '../compileProgram';
import { VariantDeclinaison } from './GLVariantShader';
import { getUniformsLocation } from '../getUniformsLocation';

export function compileDeclinaison(
  gl: AnyWebRenderingGLContext,
  variantsDefinition: VariantDeclinaison[],
  vertexSrc: string,
  fragmentSrc: string,
  attributeLocations?: {
    [name: string]: number;
  },
): void {
  for (const variant of variantsDefinition) {
    variant.program = compileProgram(gl, vertexSrc, fragmentSrc, attributeLocations, variant.flags);
    variant.uniformsLocation = getUniformsLocation(gl, variant.program);
  }
}
