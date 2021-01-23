#version 300 es

precision mediump float;

uniform mat4 mvp;

layout(location = 0) in vec3 position;
layout(location = 1) in vec2 uv;

invariant gl_Position;

out vec2 vUv;

void main(void){
  vUv = uv;
  gl_Position = mvp * vec4(position,1.0);
  
}