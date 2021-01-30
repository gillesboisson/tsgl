
precision mediump float;

uniform mat4 u_mvpMat;


attribute vec2 a_position;
attribute vec2 a_uv;

varying vec2 v_uv;
varying vec2 v_position;

void main(void){
  v_uv = a_uv;
  v_position = a_position;

  gl_Position = vec4(a_position,0.0,1.0);
  
}