import { createSkyBoxMesh } from '../geom/mesh/createSkyBoxMesh';
import { GLMesh } from '../gl/core/data/GLMesh';
import { WebGL2Renderer } from '../gl/core/GLRenderer';
import { createCubemapMipmapEmptyTexture } from '../helpers/texture/createCubemapMipmapEmptyTexture';
import { renderFaces } from '../helpers/texture/CubemapRenderer';
import { ReflectanceShaderState, ReflectanceShaderID } from '../shaders/ReflectanceShader';

export class ReflectanceCubemapRenderer {
  private _reflectanceST: ReflectanceShaderState;
  private _skybox: GLMesh;

  constructor(
    readonly renderer: WebGL2Renderer,
    readonly size: number,
    readonly levels = 5,
    readonly framebuffer: WebGLFramebuffer = renderer.gl.createFramebuffer(),
  ) {
    this._reflectanceST = renderer.getShader<ReflectanceShaderState>(ReflectanceShaderID).createState();
    this._skybox = createSkyBoxMesh(renderer.gl);
  }

  render(source: WebGLTexture, dest?: WebGLTexture): WebGLTexture {
    const gl = this.renderer.gl;
    const levels = this.levels;
    const size = this.size;
    const reflectanceST = this._reflectanceST;
    const skybox = this._skybox;

    let reflectanceCubemap: WebGLTexture;

    if (dest) {
      reflectanceCubemap = dest;
    } else {
      reflectanceCubemap = createCubemapMipmapEmptyTexture(gl, size, levels, gl.RGBA16F, gl.RGBA, gl.FLOAT).texture;
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, source);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    this._reflectanceST.use();

    for (let level = 0; level < levels; level++) {
      const lSize = size / Math.pow(2, level);
      gl.viewport(0, 0, lSize, lSize);

      reflectanceST.roughness = level / (levels - 1) / 2;
      renderFaces(gl, (gl, target, mvp) => {
        reflectanceST.mvp = mvp;
        reflectanceST.syncUniforms();

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, target, reflectanceCubemap, level);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        skybox.draw();
      });
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

    return reflectanceCubemap;
  }

  destroy(destroyFramebuffer = true): void {
    if (destroyFramebuffer) {
      this.renderer.gl.deleteFramebuffer(this.framebuffer);
    }
  }
}
