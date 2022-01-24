import { GLShaderVariantKeyValue } from './GLVariantShaderTypes';

export function createShaderVariantSlug(values: GLShaderVariantKeyValue): string {
  return Object.keys(values)
    .map(
      (name) =>
        `${name}${typeof values[name] === 'string' ? `=${values[name]}` : `=${values[name] ? 'TRUE' : 'FALSE'}`}`,
    )
    .join('|');
}
