// import { GLShader } from './shader/GLShader';
// import { IGLFrameBuffer } from './framebuffer/IGLFrameBuffer';
// import { GLCore } from './GLCore';
// import { AnyWebRenderingGLContext } from './GLHelpers';
// import { GLMesh } from './data/GLMesh';
// import { createQuadMesh } from '../../geom/MeshHelpers';

/*
export abstract class APostRenderingPass<
    UniformT extends GLUniformsData,
    ShaderT extends GLShader<UniformT>
    > extends GLCore{

    get uniformData(): UniformT {
        return this._uniformData;
    }

    protected _uniformData: UniformT;
    private _quad: GLMesh;

    constructor(
        gl: AnyWebRenderingGLContext,
        protected _shader: ShaderT,
    ){

        super(gl);
        this._uniformData = _shader.getUniforms();
        this._quad = createQuadMesh(gl);
    }

    render(){
        this._shader.use();
        this.beforeRender();
        this._quad.draw();
    }

    abstract beforeRender(): void;

    destroy(): void {
        this._quad.destroy();
    }
}
*/
