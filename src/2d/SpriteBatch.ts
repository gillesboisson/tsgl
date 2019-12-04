import {AGLBatch, GLBatchable} from "../gl/core/data/AGLBatch";
import {PositionUvColor} from "../gl/data/PositionUvColor";
import {AnyWebRenderingGLContext} from "../gl/core/GLHelpers";
import {SubTexture} from "./SubTexture";

export class SpriteBatch extends AGLBatch<PositionUvColor>{

    get nbSprite(): number {
      return this._nbSprite;
    }

    protected _currentTexture: SubTexture;


    constructor(
        gl: AnyWebRenderingGLContext,
        protected _nbSprite: number = 512
    ){
        super(gl, PositionUvColor, _nbSprite * 4, PositionUvColor.stride, _nbSprite * 2, 3);

    }

    pushElement(element: GLBatchable<PositionUvColor>) {
        super.pushElement(element);
    }

    begin() {
        super.begin();
    }

    ended(gl: AnyWebRenderingGLContext, nbPoints: number, nbIndices: number): void {
        gl.drawElements(gl.TRIANGLES, nbIndices, gl.UNSIGNED_SHORT,0);
    }

}
