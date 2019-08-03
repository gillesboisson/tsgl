import {GLRenderer, GLRendererType} from "./gl/core/GLRenderer";
import {vec2, vec3, vec4} from "gl-matrix";
import {GLBuffer} from "./gl/core/GLBuffer";
import {GLShader} from "./gl/core/GLShader";
import {getDefaultAttributeLocation, GLDefaultAttributesLocation} from "./gl/core/GLDefaultAttributesLocation";
import {
    IInterleavedData,
    interleavedData,
    InterleavedDataArray,
    interleavedProp
} from "./gl/data/InterleavedData";
import {GLTexture} from "./gl/core/GLTexture";
import GLUniformsData, {glShaderUniformProp, glShaderUniforms} from "./gl/core/GLUniformsData";
import {GLAttribute} from "./gl/core/GLAttribute";
import {GLMesh} from "./gl/core/GLMesh";
import {AGLBatch, GLBatchable, pullMethod} from "./gl/core/AGLBatch";
import {AnyWebRenderingGLContext} from "./gl/core/Helpers";
import {GLFramebuffer} from "./gl/core/GLFramebuffer";
import {glInterleavedAttributes} from "./gl/core/glInterleavedAttributes";

var SPECTOR = require("spectorjs");

const DEBUG = true;
const DEBUG_COMMANDS_START = false;
let spector: any = null;

if(DEBUG){
    spector = new SPECTOR.Spector();
}


@glInterleavedAttributes()
@interleavedData()
class PosUv implements IInterleavedData{

    @interleavedProp({
        type: Float32Array,
        length: 3,
        attributeLocation: GLDefaultAttributesLocation.POSITION,
    })
    public position: vec3;

    @interleavedProp({
        type: Float32Array,
        length: 2,
        attributeLocation: GLDefaultAttributesLocation.UV,

    })
    public uv: vec2 ;


    allocate(array: InterleavedDataArray<PosUv>, arrayBuffer: ArrayBuffer, offset: number, stride: number): void {}

}

class MyBatch extends AGLBatch<PosUv>{
    constructor(
        gl: AnyWebRenderingGLContext,
        pointLength: number,
        indexLength: number
    ){
        super(gl, PosUv, pointLength, 5 * Float32Array.BYTES_PER_ELEMENT, indexLength, 3);
    }

    ended(gl: AnyWebRenderingGLContext, nbPoints: number, nbIndices: number): void {
        this._gl.drawElements(gl.TRIANGLES, nbIndices, gl.UNSIGNED_SHORT,0);
    }
}


class MyElement implements GLBatchable<PosUv>{
    indexLength: number = 2;
    pointLength: number = 4;


    constructor(public x:number, public y: number){}

    pullFromBatch(
        points: PosUv[],
        pointInd: number,
        indices?: Uint16Array,
        indiceInd?: number,
        indiceStride?: number,
    ){

        vec3.set(points[pointInd].position,-1 + this.x,-1 + this.y, 0);
        vec3.set(points[pointInd+1].position,1 + this.x,-1 + this.y, 0);
        vec3.set(points[pointInd+2].position,-1 + this.x,1 + this.y, 0);
        vec3.set(points[pointInd+3].position,1 + this.x,1 + this.y, 0);

        vec2.set(points[pointInd].uv,0,0);
        vec2.set(points[pointInd+1].uv,1,0);
        vec2.set(points[pointInd+2].uv,0,1);
        vec2.set(points[pointInd+3].uv,1,1);


        indices[indiceInd] = pointInd;
        indices[indiceInd+1] = pointInd+1;
        indices[indiceInd+2] = pointInd+2;
        indices[indiceInd+3] = pointInd+1;
        indices[indiceInd+4] = pointInd+3;
        indices[indiceInd+5] = pointInd+2;


    }
}


@glShaderUniforms()
class MyShaderUniforms extends GLUniformsData{

    @glShaderUniformProp('i',1,'tex')
    textureInd: number = 0;

    @glShaderUniformProp('f',3,'offset')
    offset: Float32Array = new Float32Array([0,0,0]);
}


window.addEventListener('load', () => {

    const renderer = GLRenderer.createFromCanvas(
        document.getElementById('test') as HTMLCanvasElement,
    );

    document.body.append(renderer.canvas);
    const gl = renderer.getGL();

    const myFB = new GLFramebuffer(gl, 320,240, true, false);
    const myFBT = myFB.depthTexture;
    const quadB = new GLBuffer(gl,gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    quadB.bufferData(new Float32Array([
        -1,-1,0,    0,0,
        1,-1,0,     1,0,
        -1,1,0,      0,1,
        1,1,0,      1,1,
    ]));

    const quadIndex = new Uint16Array([0,1,2,1,3,2]);
    const quadIndexB = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER,gl.STATIC_DRAW);
    quadIndexB.bufferData(quadIndex);

    const attrs = [
      new GLAttribute(gl, quadB,GLDefaultAttributesLocation.POSITION,'position',3,5 * 4),
      new GLAttribute(gl, quadB,GLDefaultAttributesLocation.UV,'uv',2,5 * 4,3*4),
    ];

    const quadMesh = new GLMesh(gl,4,2,attrs,quadIndexB);


    if(DEBUG) {
        spector.displayUI();

        if(DEBUG_COMMANDS_START) spector.captureContext(gl, 100);
    }

    // const testBatch = new GLBatch<PosUv>(gl, PosUv,16, 4 * Float32Array.BYTES_PER_ELEMENT, 8, 3);

    const batch = new MyBatch(gl,16,8);

    function pull(points: PosUv[], pointInd: number, indices: Uint16Array, indiceInd?: number, indexStride?: number){

        points[pointInd].position[0] = -1;


        indices[(indiceInd)  * indexStride] = pointInd;
        indices[(indiceInd)  * indexStride + 1] = pointInd + 1;
        indices[(indiceInd)  * indexStride + 2] = pointInd + 2;

        indices[(indiceInd)  * indexStride + 3] = pointInd + 1;
        indices[(indiceInd)  * indexStride + 4] = pointInd + 3;
        indices[(indiceInd)  * indexStride + 5] = pointInd + 2;
    }

    const element1 = new MyElement(1,1);
    const element2 = new MyElement(-1,-1);
    const element3 = new MyElement(1,-1);

    const shader = new GLShader<MyShaderUniforms>(
        gl,
        `
          attribute vec3 position;
          attribute vec4 color;
          attribute vec2 uv;
          
          uniform vec3 offset;

          
          varying vec4 vColor;
          varying vec2 vUv;
        
          void main(void) {
            gl_Position = vec4(position + offset, 1.0);
            vColor = color;
            vUv = uv;
          }
        `,
        `
            
            precision highp float;
            
            uniform sampler2D tex;
            
            varying vec4 vColor;          
            varying vec2 vUv;
                
            void main(void) {
                // discard;
                vec4 tcolor = texture2D(tex, vUv);
                gl_FragColor = tcolor;
            }
        `, MyShaderUniforms, getDefaultAttributeLocation()
    );

    const postShader = new GLShader<MyShaderUniforms>(
        gl,
        `
          attribute vec3 position;
          attribute vec2 uv;
          
          uniform vec3 offset;
          varying vec2 vUv;
        
          void main(void) {
            gl_Position = vec4(position + offset, 1.0);
            vUv = uv;
          }
        `,
        `
            precision highp float;
            uniform sampler2D tex;
            
            varying vec2 vUv;
                
            void main(void) {
                vec4 tcolor = texture2D(tex, vUv);
                float c = (tcolor.x+tcolor.y+tcolor.z) / 3.0;
                gl_FragColor = vec4(c,c,c,tcolor.w);
            }
        `, MyShaderUniforms, getDefaultAttributeLocation()
    );

    // bindDefaultAttributesLocation(gl, shader.program);

    let testTexture:GLTexture = null;

    function render() {
        window.requestAnimationFrame(render);
        renderer.clear();
        shader.use();
        testTexture.bind();
        // myFB.bind();
        batch.begin();
        batch.pushElement(element1);
        batch.pushElement(element2);
        batch.pushElement(element3);
        batch.end();
        // myFB.unbind();
        // postShader.use();
        // myFBT.bind();
        // quadMesh.draw();

    }

    const img = document.createElement('img') as HTMLImageElement;

    img.addEventListener('load',() => {
        testTexture = new GLTexture(gl,gl.TEXTURE_2D,img.width,img.height);
        testTexture.uploadImage(img,gl.RGB);
        testTexture.active();
        shader.use();


        render();
    });

    img.src='./images/bb.jpg';

});




