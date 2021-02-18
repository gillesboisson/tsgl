

export function shaderVariantProp() {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return function (prototype: any, propName: string | symbol): void {
    function get() {
      return this._variantValues[propName];
    }
    function set(val: any) {
      if (val !== this._variantValues[propName]) {
        this._variantValues[propName] = val;
        this._dirtyVariant = true;
      }
    }
    Object.defineProperty(prototype, <string>propName, { get, set });
  };
}
