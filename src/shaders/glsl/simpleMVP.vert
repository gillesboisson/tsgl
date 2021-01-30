#version 300 es

precision mediump float;

uniform mat4 u_mvpMat;

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec2 a_uv;
layout(location = 3) in vec3 a_normal;

invariant gl_Position;

out vec2 v_uv;
out vec3 v_normal;
out vec3 v_position;

void main(void){
  v_uv = a_uv;
  v_normal = a_normal;
  v_position = a_position;
  gl_Position = u_mvpMat * vec4(a_position,1.0);
  
}