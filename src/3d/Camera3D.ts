import {SceneInstance3D} from "./SceneInstance3D";
import {CameraTransform3D} from "../geom/CameraTransform3D";
import {mat4} from "gl-matrix";

const tmat4= mat4.create();

export class Camera3D extends SceneInstance3D<CameraTransform3D>{
    protected _projectionMat: mat4 = mat4.create();
    protected _vpMat: mat4 = mat4.create();
    protected _dirtyVP: boolean = true;

    static createOrtho(left: number, right: number, bottom: number, top: number, near? :number, far?: number): Camera3D{
        const cam = new Camera3D();
        cam.setOrtho(left, right, bottom, top, near, far);
        return cam;
    }

    static create2D(width: number,height: number, near? :number, far?: number): Camera3D{
        const cam = new Camera3D();
        cam.setDimension2d(width, height, near, far);
        return cam;
    }

    static createPerspective(fovy: number, aspect: number, near? :number, far?: number): Camera3D{
        const cam = new Camera3D();
        cam.setPerspective(fovy, aspect, near, far);
        return cam;
    }

    private constructor(){
        super(CameraTransform3D);
    }

    setOrtho(left: number, right: number, bottom: number, top: number, near = 0.001, far = 100){
        mat4.ortho(this._projectionMat,left, right, bottom, top, near, far);
        this._dirtyVP = true;
    }

    setDimension2d(width: number,height: number, near = 0.001, far = 100){
        mat4.ortho(this._projectionMat,0, width, height, 0, near, far);
        this._dirtyVP = true;
    }

    setPerspective(fovy: number, aspect: number, near = 0.001, far = 100){
        mat4.perspective(this._projectionMat, fovy, aspect, near, far);
        this._dirtyVP = true;
    }



    updateWorldMat(parentMap: mat4 = null, worldMat?: mat4): mat4 {
        const wm = super.updateWorldMat(parentMap,worldMat);
        if(this._dirtyVP === true){
            mat4.multiply(this._vpMat, this._projectionMat, wm);
            this._dirtyVP = false;
        }
        return wm;
    }

    mvp(out: mat4, modelMat: mat4, cachedWorldMat: boolean = true){
        if(this._dirtyVP === true || !cachedWorldMat){
            mat4.multiply(this._vpMat, this._projectionMat, cachedWorldMat ? this._worldMat : this.calcWorldMat());
            this._dirtyVP = false;
        }
        mat4.multiply(out, out, modelMat);
    }

    mv(out: mat4, modelMat: mat4, cachedWorldMat: boolean = true){
        mat4.multiply(out, cachedWorldMat ? this._worldMat : this.calcWorldMat(), modelMat);
    }
}
