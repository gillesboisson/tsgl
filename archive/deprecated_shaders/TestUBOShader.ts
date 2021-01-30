import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { GLShader } from '../gl/core/shader/GLShader';
import { GLUbo } from '../gl/core/data/GLUbo';
import { GLBuffer } from '../gl/core/data/GLBuffer';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4, vec4 } from 'gl-matrix';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/testUbo.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/testUbo.vert').default;

export class TestUBOShaderState extends GLShaderState {
  protected _textureInd: number;
  protected _modelUbo: GLUbo;
  protected _modelBuffer: GLBuffer;

  constructor(shader: GLShader<TestUBOShaderState>) {
    super(shader);
    const gl: WebGL2RenderingContext = <WebGL2RenderingContext>shader.getGL();
    this._modelUbo = new GLUbo(gl, 'model', shader.getProgram());
    const b = new Float32Array(20);

    const mvp: mat4 = <mat4>new Float32Array(b.buffer, 0, 16);
    const color: vec4 = <vec4>new Float32Array(b.buffer, 16 * Float32Array.BYTES_PER_ELEMENT, 4);

    mat4.identity(mvp);
    vec4.set(color, 1, 1, 1, 1);
    this._modelBuffer = new GLBuffer(gl, gl.UNIFORM_BUFFER, gl.DYNAMIC_DRAW, b);
  }

  syncUniforms(): void {
    this._modelBuffer.bufferSubData();
    this._modelUbo.bindBufferBase(this._modelBuffer);
  }
}

export class TestUBOShader extends GLShader<TestUBOShaderState> {
  constructor(gl: WebGL2RenderingContext) {
    super(gl, vertSrc, fragSrc, TestUBOShaderState, getDefaultAttributeLocation(['position', 'uv', 'color']));
  }
}
