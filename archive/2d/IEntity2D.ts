import {Group} from "./Group";
import {Transform2D} from "../geom/Transform2D";
import {mat2d, vec4} from "gl-matrix";
import {IDispose} from "../core/IDispose";
import {IReset} from "../core/IReset";
import {SpriteBatch} from "./SpriteBatch";

export interface IEntity2D extends IDispose, IReset{
    parent: Group;
    visible: boolean;

    getTransform(): Transform2D;
    color: vec4;
    push(batch: SpriteBatch, parentMat: mat2d, fastTransform: boolean): void;
}
