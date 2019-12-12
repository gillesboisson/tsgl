import {WasmClass} from "./WasmClass";

type RelocateListener = <T>(ptr: number, oldPtr: number) => void;

export class WasmClassRelocatable extends WasmClass {
  private _relocateListeners: RelocateListener[];


  addRelocateListener(relocateListener: RelocateListener) {
    if (this._relocateListeners.indexOf(relocateListener) === -1)
      this._relocateListeners.push(relocateListener);
  }

  removeRelocateListener(relocateListener: RelocateListener) {
    const ind = this._relocateListeners.indexOf(relocateListener);
    if (ind !== -1) this._relocateListeners.splice(ind, 1);
  }

  init(firstInit?: boolean): void {
    super.init(firstInit);
    if(this._relocateListeners !== undefined){
      this._relocateListeners.splice(0);
    }else{
      this._relocateListeners = [];
    }
  }

  destroy(freePtr?: boolean) {
    this._relocateListeners.splice(0);
    this._relocateListeners = null;
    super.destroy(freePtr);
  }


  relocate(ptr: number) {
    for (let relocateListener of this._relocateListeners) relocateListener(this.ptr, this._ptr);
    this._ptr = ptr;
    this._memoryRef = new Uint8Array(this._module.HEAP8,this._ptr, this.__byteLength);
  }

}
