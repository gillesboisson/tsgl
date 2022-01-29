#version 300 es
precision mediump float;


in vec2 a_uv;
in vec3 a_position;

out vec2 v_uv;

void main(){

  v_uv = a_uv;

  gl_Position = vec4(a_position, 1.0);
}