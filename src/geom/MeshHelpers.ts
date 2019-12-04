import {AnyWebRenderingGLContext} from "../gl/core/GLHelpers";
import {GLBuffer} from "../gl/core/data/GLBuffer";
import {GLAttribute} from "../gl/core/data/GLAttribute";
import {GLDefaultAttributesLocation} from "../gl/core/data/GLDefaultAttributesLocation";
import {GLMesh} from "../gl/core/data/GLMesh";


export function createQuadMesh(gl: AnyWebRenderingGLContext, drawType: GLenum = gl.STATIC_DRAW) {

    const quadB = new GLBuffer(gl, gl.ARRAY_BUFFER, drawType);
    quadB.bufferData(new Float32Array([
        -1, -1, 0, 0, 0,
        1, -1, 0, 1, 0,
        -1, 1, 0, 0, 1,
        1, 1, 0, 1, 1,
    ]));

    const quadIndex = new Uint16Array([0, 1, 2, 1, 3, 2]);
    const quadIndexB = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, drawType);
    quadIndexB.bufferData(quadIndex);

    const attrs = [
        new GLAttribute(gl, quadB, GLDefaultAttributesLocation.POSITION, 'position', 3, 5 * 4),
        new GLAttribute(gl, quadB, GLDefaultAttributesLocation.UV, 'uv', 2, 5 * 4, 3 * 4),
    ];

    return new GLMesh(gl, 4, 2, attrs, quadIndexB);
}

export function createWiredBoxMesh(
    gl: AnyWebRenderingGLContext,
    scaleX: number,
    scaleY: number,
    scaleZ: number,
    drawType: GLenum = gl.STATIC_DRAW) {

    const quadB = new GLBuffer(gl, gl.ARRAY_BUFFER, drawType);
    quadB.bufferData(new Float32Array([
        -1, -1, 0,
        1, -1, 0,
        -1, 1, 0,
        1, 1, 0,
    ]));

    const quadIndex = new Uint16Array([0, 1, 2, 1, 3, 2]);
    const quadIndexB = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, drawType);
    quadIndexB.bufferData(quadIndex);

    const attrs = [
        new GLAttribute(gl, quadB, GLDefaultAttributesLocation.POSITION, 'position', 3, 5 * 4),
        new GLAttribute(gl, quadB, GLDefaultAttributesLocation.UV, 'uv', 2, 5 * 4, 3 * 4),
    ];

    return new GLMesh(gl, 4, 2, attrs, quadIndexB);

}
