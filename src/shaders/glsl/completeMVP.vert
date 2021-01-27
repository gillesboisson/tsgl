#version 300 es

precision mediump float;

uniform mat4 mvpMat;
uniform mat4 normalMat;
uniform mat4 modelMat;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec2 aUv;
layout(location = 3) in vec3 aNormal;
layout(location = 5) in vec4 aTangent;

invariant gl_Position;

out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;
out vec4 vTangent;

out mat3 vTBN;

void main(void){

  
  vec3 normal = normalize(aNormal);
  vUv = aUv;
  vNormal = normalize((normalMat * vec4(normal,1.0)).xyz);
  vPosition = (modelMat * vec4(aPosition,1.0)).xyz;

  // define TBD (Tangent Bitangent Normal) mat
  vec3 tangent = normalize(aTangent).xyz;
  // apply normal mat (model / cam) to normal
  vec3 normalW = normalize(vec3(normalMat * vec4(normal, 0.0)));
  // apply model mat to tangent
  vec3 tangentW = normalize(vec3(modelMat * vec4(tangent, 0.0)));
  // calc bitangent
  vec3 bitangentW = cross(normalW, tangentW) * aTangent.w;
  // set the output mat
  vTBN = mat3(tangentW, bitangentW, normalW);



  gl_Position = mvpMat * vec4(aPosition,1.0);
  
}