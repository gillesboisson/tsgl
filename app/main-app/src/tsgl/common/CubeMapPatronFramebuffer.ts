
import { GLMesh, CubeMapFramebuffer, AnyWebRenderingGLContext, GLRenderer, GLBuffer, GLAttribute, GLDefaultAttributesLocation, GLTexture2D } from '../gl';
import { SimpleSpriteShaderState } from './shaders/simpleSprite/SimpleSpriteShaderState';

type NewType = CubeMapFramebuffer;

export class CubeMapPatronFramebuffer extends CubeMapFramebuffer {
  private _meshes: GLMesh[];
  readonly gl: AnyWebRenderingGLContext;
  private _patronSS: SimpleSpriteShaderState;
  get meshes(): GLMesh[] {
    return this._meshes;
  }

  constructor(readonly renderer: GLRenderer, size: number) {
    super(renderer.gl, size);
    this.createMesh(renderer.gl);

    this._patronSS = renderer.getShader('test_flat').createState() as SimpleSpriteShaderState;
    // new Float)
  }

  createMesh(gl: AnyWebRenderingGLContext): void {
    // canvas uv map is
    //    +--+
    //    |ny|
    // +--+--+-----+
    // |nx|pz|px|nz|
    // +--+--+-----+
    //    |py|
    //    +--+
    //

    // create grid based on canvas
    const xS = new Array(5); // 4 blocks in X
    const yS = new Array(4); // 3 blocks in Y

    for (let i = 0; i < xS.length; i++) {
      xS[i] = i / 4;
    }

    for (let i = 0; i < yS.length; i++) {
      yS[i] = 1 - i / 3;
    }

    // create common buffer for each face
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);
    const positionBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    positionBuffer.bufferData(positions);
    const quadIndexB = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
    quadIndexB.bufferData(indices);

    // mesh order  posx.*, negx.*, posy.*, negy.*, posz.* and negz.*
    // !! uvY is inverted from flat patron to cubemap
    // create separate uv data for each face using grid position
    const uvPosX = new Float32Array([xS[2], yS[2], xS[3], yS[2], xS[2], yS[1], xS[3], yS[1]]);
    const uvNegX = new Float32Array([xS[0], yS[2], xS[1], yS[2], xS[0], yS[1], xS[1], yS[1]]);
    const uvPosY = new Float32Array([xS[1], yS[3], xS[2], yS[3], xS[1], yS[2], xS[2], yS[2]]);
    const uvNegY = new Float32Array([xS[1], yS[1], xS[2], yS[1], xS[1], yS[0], xS[2], yS[0]]);
    const uvPosZ = new Float32Array([xS[1], yS[2], xS[2], yS[2], xS[1], yS[1], xS[2], yS[1]]);
    const uvNegZ = new Float32Array([xS[3], yS[2], xS[4], yS[2], xS[3], yS[1], xS[4], yS[1]]);

    // gen mesh sub function
    function genMesh(uv: Float32Array): GLMesh {
      const uvBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
      uvBuffer.bufferData(new Float32Array(uv));

      const attrs = [
        new GLAttribute(gl, positionBuffer, GLDefaultAttributesLocation.POSITION, 'position', 2, 8),
        new GLAttribute(gl, uvBuffer, GLDefaultAttributesLocation.UV, 'uv', 2, 8),
      ];

      return new GLMesh(gl, 4, 2, attrs, quadIndexB);
    }

    // image order  2 posy.*, negy.*, posz.* and negz.*

    this._meshes = [
      genMesh(uvPosX),
      genMesh(uvNegX),
      genMesh(uvPosY),
      genMesh(uvNegY),
      genMesh(uvPosZ),
      genMesh(uvNegZ),
    ];
  }

  unwrap(patron: GLTexture2D, resizeFramebufferFromTextureSize = true): void {
    if (resizeFramebufferFromTextureSize) {
      const size = patron.width / 4;
      if (size !== this._size) {
        this.resize(size);
      }
    }

    // activate patron texture (default COLOR location = 0)
    patron.active();
    this.render();
  }

  render(): void {
    this._patronSS.use();
    super.render();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderSide(gl: AnyWebRenderingGLContext, side: number): void {
    this._meshes[side].draw();
  }
}
