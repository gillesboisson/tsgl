import { AnyWebRenderingGLContext } from '../GLHelpers';

export function getUniformsLocation(
  gl: AnyWebRenderingGLContext,
  program: WebGLProgram,
  uniformsName?: string[],
): {
  [name: string]: WebGLUniformLocation;
} {
  const nbUniforms =
    uniformsName !== undefined ? uniformsName.length : gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  const res: {
    [name: string]: WebGLUniformLocation;
  } = {};

  if (uniformsName !== undefined) {
    for (let i = 0; i < nbUniforms; i++) {
      const uniformName = uniformsName[i];
      res[uniformName] = <WebGLUniformLocation>gl.getUniformLocation(program, uniformName);
    }
  } else {
    for (let i = 0; i < nbUniforms; i++) {
      const uniformName = gl.getActiveUniform(program, i).name;
      res[uniformName] = <WebGLUniformLocation>gl.getUniformLocation(program, uniformName);
    }
  }
  return res;
}
