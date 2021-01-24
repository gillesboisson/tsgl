export interface IGLDataExtras {
  extras?: { [key: string]: string | number };
}

export interface IGLTFCore<DataT extends IGLDataExtras> {
  readonly data: DataT;
  customProp<PropT = number | string>(propName: string, defaultVal?: PropT): PropT;
}

export abstract class GLTFCore<DataT extends IGLDataExtras> implements IGLTFCore<DataT> {
  protected _data: DataT;

  get data(): DataT {
    return this._data;
  }

  protected _extras?: { [key: string]: string | number };

  customProp<PropT = number | string>(propName: string, defaultVal?: PropT): PropT {
    return (this._extras && this._extras[propName] ? this._extras[propName] : defaultVal) as any;
  }

  constructor(data: DataT) {
    this._data = data;
    this._extras = data.extras;
  }
}
