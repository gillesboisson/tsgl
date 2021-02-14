precision mediump float;

uniform mat4 u_mvpMat;

attribute vec3 a_position;
attribute vec2 a_uv;

varying vec2 v_uv;


void main(void){
  v_uv = a_uv;
  gl_Position = u_mvpMat * vec4(a_position,1.0);
}