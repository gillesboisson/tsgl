#version 300 es

precision mediump float;

uniform mat4 u_mvpMat;
uniform mat4 u_normalMat;
uniform mat4 u_modelMat;

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec2 a_uv;
layout(location = 3) in vec3 a_normal;
layout(location = 5) in vec4 a_tangent;

out vec2 v_uv;
out vec3 v_normal;
out vec3 v_position;
out vec4 v_tangent;

out mat3 v_TBN;

invariant gl_Position;

void main(void){

  
  vec3 normal = normalize(a_normal);
  v_uv = a_uv;
  v_normal = normalize((u_normalMat * vec4(normal,1.0)).xyz);
  v_position = (u_modelMat * vec4(a_position,1.0)).xyz;

  // define TBD (Tangent Bitangent Normal) mat
  vec3 tangent = normalize(a_tangent).xyz;
  // apply normal mat (model / cam) to normal
  vec3 normalW = normalize(vec3(u_normalMat * vec4(normal, 0.0)));
  // apply model mat to tangent
  vec3 tangentW = normalize(vec3(u_modelMat * vec4(tangent, 0.0)));
  // calc bitangent
  vec3 bitangentW = cross(normalW, tangentW) * a_tangent.w;
  // set the output mat
  v_TBN = mat3(tangentW, bitangentW, normalW);



  gl_Position = u_mvpMat * vec4(a_position,1.0);
  
}