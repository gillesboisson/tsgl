import { GLVariantValueDefinition, GLShaderVariantKeyValue, GLVariantDeclinaison } from './GLVariantShaderTypes';



export function valueDefinitionsToVariantDeclinaison(
  definitions: { [name: string]: GLVariantValueDefinition[]; },

  definitionNames: string[] = Object.keys(definitions),
  currentRec = 0,
  values: GLShaderVariantKeyValue = {},
  flags: GLShaderVariantKeyValue = {},
  declinaisons: GLVariantDeclinaison[] = []
): GLVariantDeclinaison[] {
  const currentDefinitionName = definitionNames[currentRec];
  const isLastRec = currentRec === definitionNames.length - 1;

  const definitionValues = definitions[currentDefinitionName];

  definitionValues.forEach((val) => {
    const declinaisonValues = { ...values, [currentDefinitionName]: val.value };
    const declinaisonFlags = { ...flags, ...val.flags };

    if (isLastRec) {
      declinaisons.push({
        values: declinaisonValues,
        flags: declinaisonFlags,
      });
    } else {
      valueDefinitionsToVariantDeclinaison(
        definitions,
        definitionNames,
        currentRec + 1,
        declinaisonValues,
        declinaisonFlags,
        declinaisons
      );
    }
  });

  return declinaisons;
}
