import { AnyWebRenderingGLContext } from '../GLHelpers';
import { GLShaderPrecompileFlags } from './GLShader';
import { compileShader } from './compileShader';
export function compileProgram(
  gl: AnyWebRenderingGLContext,
  vertexSrc: string,
  fragmentSrc: string,
  attributeLocations?: {
    [name: string]: number;
  },
  flags?: GLShaderPrecompileFlags,
  beforeLink?: (gl: AnyWebRenderingGLContext, program: WebGLProgram) => void,
): WebGLProgram {
  var glVertShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc, flags);
  var glFragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc, flags);
  var program = gl.createProgram();
  gl.attachShader(program, glVertShader);
  gl.attachShader(program, glFragShader);
  // optionally, set the attributesLocation manually for the program rather than letting WebGL decide..
  if (attributeLocations !== null) {
    for (var i in attributeLocations) {
      gl.bindAttribLocation(program, attributeLocations[i], i);
    }
  }
  if (beforeLink !== undefined) beforeLink(gl, program);
  gl.linkProgram(program);
  // if linking fails, then log and cleanup
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('GLSL Error: Could not initialize shader.');
    console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
    console.error('gl.getError()', gl.getError());
    // if there is a program info log, log it
    if (gl.getProgramInfoLog(program) !== '') {
      throw new Error(gl.getProgramInfoLog(program));
      //console.warn('GLSL Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
    }
    gl.deleteProgram(program);
    program = null;
  }
  // clean up some shaders
  gl.deleteShader(glVertShader);
  gl.deleteShader(glFragShader);
  return program;
}
