#version 300 es
precision mediump float;


layout(location = 0) in vec3 a_position;
layout(location = 1) in vec2 a_uv;

out vec2 v_uv;

invariant gl_Position;

void main(void){
  v_uv = vec2(a_uv.x,a_uv.y);
  gl_Position = vec4(a_position,1.0);
}