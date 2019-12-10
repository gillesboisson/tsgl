export interface IUse {
  use(): void;
}

export interface IShaderProgram extends IUse {
  getProgram(): WebGLProgram;
}
