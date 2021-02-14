import { TestIrradianceID, IrradianceShaderState } from '../app/shaders/TestIrradianceShader';
import { GLAttribute } from '../gl/core/data/GLAttribute';
import { GLBuffer } from '../gl/core/data/GLBuffer';
import { GLDefaultAttributesLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { GLMesh } from '../gl/core/data/GLMesh';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLRenderer } from '../gl/core/GLRenderer';
import { GLTexture } from '../gl/core/GLTexture';
import { CubeMapFramebuffer } from './CubeMapFramebuffer';

export class IrradianceHelper extends CubeMapFramebuffer {
  private _meshes: GLMesh[];
  readonly gl: AnyWebRenderingGLContext;
  private _irradianceSS: IrradianceShaderState;
  get meshes(): GLMesh[] {
    return this._meshes;
  }

  constructor(readonly renderer: GLRenderer,size: number) {
    super(renderer.gl, size);
    this.createMesh(renderer.gl);

    this._irradianceSS = renderer.getShader(TestIrradianceID).createState() as IrradianceShaderState;
    // new Float)
  }

  createMesh(gl: AnyWebRenderingGLContext): void {
    

    // create common buffer for each face
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);
    const positionBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    positionBuffer.bufferData(positions);
    const quadIndexB = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
    quadIndexB.bufferData(indices);

    // image order  posx.*, negx.*, posy.*, negy.*, posz.* and negz.*
    // create separate uv data for each face using grid position
    const normalNegX = new Float32Array([
      -1,1,-1,
      -1,1,1,
      -1,-1,-1,
      -1,-1,1
    ]);
    const normalPosX = new Float32Array([
      1,1,1,
      1,1,-1,
      1,-1,1,
      1,-1,-1,
    ]);
    const normalNegZ = new Float32Array([
      1,1,-1,
      -1,1,-1,
      1,-1,-1,
      -1,-1,-1,


    ]);
    const normalPosZ = new Float32Array([
      -1,1,1,
      1,1,1,
      -1,-1,1,
      1,-1,1,

    ]);
    
    const normalPosY = new Float32Array([
      -1,1,-1,
      1,1,-1,
      -1,1,1,
      1,1,1
    ]);

    const normalNegY = new Float32Array([
      -1,-1,1,
      1,-1,1,
      -1,-1,-1,
      1,-1,-1
    ]);

    // gen mesh sub function
    function genMesh(normal: Float32Array): GLMesh {
      const normalBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
      normalBuffer.bufferData(new Float32Array(normal));

      const attrs = [
        new GLAttribute(gl, positionBuffer, GLDefaultAttributesLocation.POSITION, 'position', 2, 8),
        new GLAttribute(gl, normalBuffer, GLDefaultAttributesLocation.NORMAL, 'normal', 3, 12),
      ];

      return new GLMesh(gl, 4, 2, attrs, quadIndexB);
    }

    // image order  2 posy.*, negy.*, posz.* and negz.*

    this._meshes = [
      genMesh(normalPosX),
      genMesh(normalNegX),
      genMesh(normalPosY),
      genMesh(normalNegY),
      genMesh(normalPosZ),
      genMesh(normalNegZ),
    ];
  }

  
  unwrap(sourceCubemap: GLTexture): void {
    sourceCubemap.active();
    this.render();
  }

  render(): void {
    this._irradianceSS.use();
    super.render();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderSide(gl: AnyWebRenderingGLContext, side: number): void {
    this._meshes[side].draw();
  }
}
