

  mat3 tbnMat(
    vec3 normal,
    vec4 tangentSource,
    mat4 normalMat,
    mat4 modelMat
  ){

  // define TBN (Tangent Bitangent Normal) mat
  vec3 tangent = normalize(tangentSource).xyz;
  // apply normal mat (model / cam) to normal
  vec3 normalW = normalize(vec3(normalMat * vec4(normal, 0.0)));
  // apply model mat to tangent
  vec3 tangentW = normalize(vec3(modelMat * vec4(tangent, 0.0)));
  // calc bitangent
  vec3 bitangentW = cross(normalW, tangentW) * tangentSource.w;
  // set the output mat
  return mat3(tangentW, bitangentW, normalW);
}

#pragma glslify: export(tbnMat)