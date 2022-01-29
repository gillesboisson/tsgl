export function getUniformsInfo(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
): {
  [name: string]: WebGLActiveInfo;
} {
  const nbUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  const res: {
    [name: string]: WebGLActiveInfo;
  } = {};
  for (let i = 0; i < nbUniforms; i++) {
    const uniform = gl.getActiveUniform(program, i);
    res[uniform.name] = uniform;
  }
  return res;
}
