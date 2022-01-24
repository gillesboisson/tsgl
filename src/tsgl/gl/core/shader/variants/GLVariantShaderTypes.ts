export type GLShaderVariantKeyValue = { [name: string]: string | boolean };

export type GLVariantValueDefinition = {
  value: string | boolean;
  default?: boolean;
  flags: GLShaderVariantKeyValue;
};

export type GLVariantDeclinaison = {
  values: GLShaderVariantKeyValue;
  flags: GLShaderVariantKeyValue;
};
