import { mat4 } from 'gl-matrix';
import { getDefaultAttributeLocation, setDefaultTextureLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { GLShader } from '../../gl/core/shader/GLShader';
import { GLShaderState } from '../../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../../gl/core/shader/IGLShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/irradiance.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('../../shaders/glsl/flat_2d.vert').default;

export class IrradianceShaderState extends GLShaderState implements IGLShaderState {
  syncUniforms(): void {}
}

export const TestIrradianceID = 'irradiance';

export class IrradianceShader extends GLShader<IrradianceShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      TestIrradianceID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new IrradianceShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, IrradianceShaderState,getDefaultAttributeLocation(['a_position','a_uv','a_normal']));
    setDefaultTextureLocation(this, ['u_texture']);
  }
}
