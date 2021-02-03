import { GLVariantValueDefinition, GLShaderVariantKeyValue } from './GLVariantShaderTypes';



export function defaultValues(valueDefinitions: {
  [name: string]: GLVariantValueDefinition[];
}): GLShaderVariantKeyValue {
  const res: GLShaderVariantKeyValue = {};
  Object.keys(valueDefinitions).forEach((name) => {
    let value: string | boolean = valueDefinitions[name].find((def) => def.default === true)?.value; // take value declinaison.default = true
    if (value === undefined)
      value = valueDefinitions[name][0].value; // or take first one
    res[name] = value;
  });

  return res;
}
