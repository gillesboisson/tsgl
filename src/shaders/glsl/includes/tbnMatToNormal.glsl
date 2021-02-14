

vec3 tbnMatToNormal(
  mat3 tbnMat,
  vec3 normal,
  vec3 eyeDirection
){

  vec3 t, b, ng;

  // TBN split
  t = normalize(tbnMat[0]);
  b = normalize(tbnMat[1]);
  ng = normalize(tbnMat[2]);

  // float facing = step(dot(eyeDirection, ng),0.0) * 2.0 - 1.0;
  // t *= facing;
  // b *= facing;
  // ng *= facing;

  return mat3(t, b, ng) * normalize(normal);
}

#pragma glslify: export(tbnMatToNormal)