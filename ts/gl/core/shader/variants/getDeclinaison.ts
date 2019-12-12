import { GLShaderPrecompileFlags } from '../GLShader';
import { VariantDefinition, VariantDeclinaison } from './GLVariantShader';
export function getDeclinaison(
  definitions: VariantDefinition,
  extraFlags: GLShaderPrecompileFlags = {},
  declinaisons: VariantDeclinaison[] = [],
  variantK: string[] = [],
  variantV: (string | null)[] = [],
  iteration = 0,
  names = Object.keys(definitions),
): VariantDeclinaison[] {
  const name = names[iteration];
  const def = definitions[name];
  for (const val of def.possibleValues) {
    const variantKey = [...variantK, def.flagName];
    const variantValue = [...variantV, val];
    const flags = { ...extraFlags };
    flags[def.flagName] = val;
    if (iteration === names.length - 1) {
      declinaisons.push({ variantKey, variantValue, flags, program: null, uniformsLocation: null });
    } else {
      getDeclinaison(definitions, flags, declinaisons, variantKey, variantValue, iteration + 1, names);
    }
  }
  return declinaisons;
}
