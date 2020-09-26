export function shaderVariantEnumProp(flagName: string, availableValues: any[]) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return function (prototype: any, propName: string | symbol): void {
    // init variant meta data
    if (prototype.__variantsDefinition === undefined) {
      prototype.__variantsDefinition = [];
      prototype.__variantsValues = [];
    }
    prototype.__variantsDefinition.push({
      flagName,
      possibleValues: availableValues,
    });
    // create getter setter
    const ind = prototype.__variantsValues.length;
    prototype.__variantsValues.push(prototype[<string>propName]);
    function get() {
      return this.__variantsValues[ind];
    }
    function set(val: any) {
      if (val !== this.__variantsValues[ind]) {
        this.__variantsValues[ind] = val;
        this._dirtyVariant = true;
      }
    }
    Object.defineProperty(prototype, <string>propName, { get, set });
  };
}
