export function shaderVariantBoolProp(flagName: string, valueTrue = 1, valueFalse = 0) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return function (prototype: any, propName: string | symbol): void {
    if (prototype.__variantsDefinition === undefined) {
      prototype.__variantsDefinition = [];
      prototype.__variantsValues = [];
    }
    prototype.__variantsDefinition.push({
      flagName,
      possibleValues: [valueFalse, valueTrue],
    });
    const ind = prototype.__variantsValues.length;
    prototype.__variantsValues.push(prototype[<string>propName] === true ? valueTrue : valueFalse);
    function get() {
      return this.__variantsValues[ind] === valueTrue;
    }
    function set(val: any) {
      if ((this.__variantsValues[ind] === valueTrue) !== val) {
        this.__variantsValues[ind] = val === true ? valueTrue : valueFalse;
        this._dirtyVariant = true;
      }
    }
    Object.defineProperty(prototype, <string>propName, { get, set });
  };
}
