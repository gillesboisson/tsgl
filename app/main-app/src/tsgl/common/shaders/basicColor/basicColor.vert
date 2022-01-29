#version 300 es

precision mediump float;

uniform mat4 u_mvpMat;

layout(location = 0) in vec3 a_position;

invariant gl_Position;


void main(void){
  gl_Position = u_mvpMat * vec4(a_position,1.0);
}