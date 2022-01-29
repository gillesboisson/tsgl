#version 300 es
precision mediump float;

uniform mat4 u_mvpMat;
uniform mat4 u_modelMat;
uniform mat4 u_normalMat;

in vec3 a_position;
in vec2 a_uv;
in vec3 a_normal;


out vec2 v_uv;
out vec3 v_normal;
out vec3 v_position;

void main(void){
  v_uv = a_uv;
  v_position = (u_modelMat * vec4(a_position, 1.0)).xyz;
  v_normal = (u_normalMat * vec4(a_normal, 1.0)).xyz;


  gl_Position = u_mvpMat * vec4(a_position,1.0);
  
}