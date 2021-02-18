import { AnyWebRenderingGLContext } from '../GLHelpers';
import { GLShaderPrecompileFlags } from './GLShader';
export function compileShader(
  gl: AnyWebRenderingGLContext,
  shaderType: GLenum,
  src: string,
  flags?: GLShaderPrecompileFlags,
): WebGLShader {
  const shader = gl.createShader(shaderType);
  let defines = '';
  if (flags !== undefined) {
    for (const key in flags) {
      if (flags.hasOwnProperty(key)) {
        let val = flags[key];
        if (typeof val === 'string') val = `"${val}"`;
        defines += `#define ${key} ${flags[key] === true ? '' : flags[key]} \n`;
      }
    }
    const srcSPL = src.split('\n');
    srcSPL.splice(1, 0, defines);
    src = srcSPL.join('\n');
  }
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    //console.log(gl.getShaderInfoLog(shader));

    const srcLineN =  src.split("\n").map((val,ind) => `${ind+1} ${val}`).join("\n");

    console.warn('shader src', srcLineN);
    throw new Error(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}
