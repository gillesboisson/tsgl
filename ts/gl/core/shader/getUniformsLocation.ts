import { AnyWebRenderingGLContext } from '../GLHelpers';

export function getUniformsLocation(
  gl: AnyWebRenderingGLContext,
  program: WebGLProgram,
): {
  [name: string]: WebGLUniformLocation;
} {
  const nbUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  const res: {
    [name: string]: WebGLUniformLocation;
  } = {};
  for (let i = 0; i < nbUniforms; i++) {
    const uniform = gl.getActiveUniform(program, i);
    res[uniform.name] = <WebGLUniformLocation>gl.getUniformLocation(program, uniform.name);
  }
  return res;
}
