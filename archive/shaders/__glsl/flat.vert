
precision mediump float;

uniform mat4 u_mvpMat;


attribute vec3 a_position;
attribute vec2 a_uv;

varying vec2 v_uv;
varying vec3 v_position;

void main(void){
  v_uv = a_uv;
  v_position = a_position;

  gl_Position = vec4(a_position,1.0);
  
}