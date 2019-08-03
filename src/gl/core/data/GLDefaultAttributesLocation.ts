
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
    IORIENTATION = 11,
    ICOLOR = 12,
    ISCALE = 13,
}

export function getDefaultAttributeLocation(): { [name: string]: number } {
    return {
        "position": GLDefaultAttributesLocation.POSITION,
        "uv": GLDefaultAttributesLocation.UV,
        "uv2": GLDefaultAttributesLocation.UV2,
        "normal": GLDefaultAttributesLocation.NORMAL,
        "color": GLDefaultAttributesLocation.COLOR,
        "tangent": GLDefaultAttributesLocation.TANGENT,
        "joint": GLDefaultAttributesLocation.JOINT,
        "weight": GLDefaultAttributesLocation.WEIGHT,
        "iposition": GLDefaultAttributesLocation.IPOSITION,
        "iorientation": GLDefaultAttributesLocation.IORIENTATION,
        "icolor": GLDefaultAttributesLocation.ICOLOR,
        "iscale": GLDefaultAttributesLocation.ISCALE,
    };
}
