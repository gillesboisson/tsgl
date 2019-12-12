export enum GLDefaultAttributesLocation {
  POSITION = 0,
  UV = 1,
  UV2 = 2,
  NORMAL = 3,
  COLOR = 4,
  TANGENT = 5,
  JOINT = 6,
  WEIGHT = 7,
  IPOSITION = 10,
  IVELOCITY = 11,
  IORIENTATION = 12,
  ICOLOR = 13,
  ISCALE = 14,
}

const defaultAttributes: { [name: string]: number } = {
  position: GLDefaultAttributesLocation.POSITION,
  uv: GLDefaultAttributesLocation.UV,
  uv2: GLDefaultAttributesLocation.UV2,
  normal: GLDefaultAttributesLocation.NORMAL,
  color: GLDefaultAttributesLocation.COLOR,
  tangent: GLDefaultAttributesLocation.TANGENT,
  joint: GLDefaultAttributesLocation.JOINT,
  weight: GLDefaultAttributesLocation.WEIGHT,
  iposition: GLDefaultAttributesLocation.IPOSITION,
  iorientation: GLDefaultAttributesLocation.IORIENTATION,
  ivelocity: GLDefaultAttributesLocation.IVELOCITY,
  icolor: GLDefaultAttributesLocation.ICOLOR,
  iscale: GLDefaultAttributesLocation.ISCALE,
};

export function getDefaultAttributeLocation(only?: string[]): { [name: string]: number } {
  const res = only === undefined ? defaultAttributes : {};
  if (only === undefined) {
    return defaultAttributes;
  } else {
    const res: { [name: string]: number } = {};
    for (const attrName of only) {
      res[attrName] = defaultAttributes[attrName];
    }

    return res;
  }
}
