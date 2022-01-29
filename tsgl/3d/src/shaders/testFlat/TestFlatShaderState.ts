import { GLShaderState, IGLShaderState } from '@tsgl/gl';


export class TestFlatShaderState extends GLShaderState implements IGLShaderState {
  syncUniforms(): void { }
}
