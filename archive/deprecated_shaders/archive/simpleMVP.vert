#version 300 es

precision mediump float;

uniform mat4 mvpMat;

layout(location = 0) in vec3 position;
layout(location = 1) in vec2 uv;
layout(location = 3) in vec3 normal;

invariant gl_Position;

out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;

void main(void){
  vUv = uv;
  vNormal = normal;
  vPosition = position;
  gl_Position = mvpMat * vec4(position,1.0);
  
}