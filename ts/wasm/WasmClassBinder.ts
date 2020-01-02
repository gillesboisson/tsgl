import { WasmClass } from './WasmClass';

export class WasmClassBinder<T extends WasmClass> {
  protected _dictionnary: { [ptr: string]: T } = {};

  public get dictionnary(): { [ptr: string]: T } {
    return this._dictionnary;
  }

  getElementFromPtr(ptr: number): T {
    return this._dictionnary[ptr.toString(16)];
  }

  add(element: T) {
    if (this._dictionnary[element.ptrStr] !== undefined) throw new Error('Element already existing at this address');
    this._dictionnary[element.ptrStr] = element;
  }

  remove(element: T) {
    if (this._dictionnary[element.ptrStr] === undefined) throw new Error("Element doesn' exist");
    delete this._dictionnary[element.ptrStr];
  }

  constructor(protected _bindings: { [name: string]: (element: T, ...args: any) => void }) {
    for (const bind in _bindings) {
      if (_bindings.hasOwnProperty(bind)) {
        (<any>global)[bind] = (ptr: number, ...args: any) => {
          _bindings[bind](this.getElementFromPtr(ptr), ...args);
        };
      }
    }
  }
}
