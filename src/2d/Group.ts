import {IEntity2D} from "./IEntity2D";
import {mat2d, vec4} from "gl-matrix";
import {Transform2D} from "../geom/Transform2D";
import {SpriteBatch} from "./SpriteBatch";

export class Group implements IEntity2D {
    protected children: IEntity2D[];
    color: vec4 = vec4.create();
    parent: Group = null;
    protected _transform2d: Transform2D = new Transform2D();

    constructor() {
        this.children = [];
    }

    addChild(child: IEntity2D, index: number = -1) {
        if (this.children.indexOf(child) !== -1) {
            if (index === -1 || index >= this.children.length) {
                this.children.push(child)
            } else {
                this.children.splice(index, 0, child);
            }
        }
    }

    removeChild(child: IEntity2D) {
        const ind = this.children.indexOf(child);
        if (ind !== -1) this.children.splice(ind, 1);
    }

    removeAllChildren() {
        this.children.splice(0);
    }

    dispose() {
        this.removeAllChildren();
        this.children = null;
    }


    getTransform(): Transform2D {
        return this._transform2d;
    }

    render(): void {

    }

    updateGeom(): void {
    }

    visible: boolean;

    push(batch: SpriteBatch, parentMat: mat2d, fastTransform: boolean): void {
    }

    reset(): void {
        this.visible = true;
        if (this.parent) this.parent.removeChild(this);
        this.parent = null;
        vec4.set(this.color, 1, 1, 1, 1);
    }
}
