import {GLBatchable} from "../../gl/core/data/AGLBatch";
import {PositionUvColor} from "../../gl/data/PositionUvColor";
import {Transform2D} from "../../geom/Transform2D";
import {mat2d, vec4} from "gl-matrix";
import {Group} from "../Group";
import {IEntity2D} from "../IEntity2D";
import {SpriteBatch} from "../SpriteBatch";

export abstract class Poly implements GLBatchable<PositionUvColor>, IEntity2D {
    visible = true;
    parent: Group = null;
    color = vec4.create();

    protected _transform: Transform2D = new Transform2D();
    protected _worldMat: mat2d = mat2d.create();

    abstract render(): void;

    abstract updateGeom(): void;

    constructor(
        public pointLength: number,
        public indexLength: number,
    ) {
        this.reset();
    }

    abstract pullFromBatch(
        points: PositionUvColor[],
        pointInd: number,
        indices?: Uint16Array,
        indiceInd?: number,
        indiceStride?: number,
    ): void;

    getTransform(): Transform2D {
        return this._transform;
    }

    dispose() {
        // super.dispose();
        if (this.parent !== null)
            this.parent.removeChild(this);

        this.parent = null;
        this._transform.dispose();
        this._transform = null;
        this.color = null;
        this._worldMat = null;
    }

    reset(): void {
        this._transform.reset();
        this.visible = true;
        vec4.set(this.color, 1, 1, 1, 1);
        if(this.parent) this.parent.removeChild(this);
        this.parent = null;
    }

    push(batch: SpriteBatch, parentMat: mat2d, fastTransform: boolean): void {
    }

}
