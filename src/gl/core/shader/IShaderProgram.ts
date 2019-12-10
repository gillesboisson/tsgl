export interface IUse {
  use(): void;
}

export interface ISyncUniform {
  syncUniforms(): void;
}

export interface IShaderProgram extends IUse {
  getProgram(): WebGLProgram;
}
