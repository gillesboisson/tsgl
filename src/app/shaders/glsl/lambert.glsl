
float lambert(mat4 mvMat, vec3 position, vec3 normal, vec3 lightPos){
  vec3 modelViewVertex = vec3(mvMat * vec4(position,1.0));

  // Transform the normal's orientation into eye space.
  vec3 modelViewNormal = vec3(mvMat * vec4(normal, 0.0));

  // Will be used for attenuation.
  float distance = length(lightPos - modelViewVertex);

  // Get a lighting direction vector from the light to the vertex.
  vec3 lightVector = normalize(lightPos - modelViewVertex);

  // Calculate the dot product of the light vector and vertex normal. If the normal and light vector are
  // pointing in the same direction then it will get max illumination.
  float diffuse = max(dot(modelViewNormal, lightVector), 0.1);

  // Attenuate the light based on distance.
  return diffuse * (1.0 / (1.0 + (0.25 * distance * distance)));
}

#pragma glslify: export(lambert)