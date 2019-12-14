import {Poly} from "./Poly";
import {PositionUvColor} from "../../gl/data/PositionUvColor";
import {pullMethod} from "../../gl/core/data/AGLBatch";

export class Sprite extends Poly{

    constructor(){
        super(4, 6);
    }


    pullFromBatch(
        points: PositionUvColor[],
        pointInd: number,
        indices?: Uint16Array,
        indiceInd?: number,
        indiceStride?: number,
    ): void{
        // points[0].position.set
    }

    render(): void {
    }

    updateGeom(): void {
    }

}
