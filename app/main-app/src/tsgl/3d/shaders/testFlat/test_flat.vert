
precision mediump float;

uniform mat4 u_mvpMat;


attribute vec2 a_position;
attribute vec2 a_uv;
attribute vec3 a_normal;

varying vec2 v_uv;
varying vec2 v_position;
varying vec3 v_normal;

void main(void){
  v_uv = a_uv;
  v_position = a_position;
  v_normal = a_normal;

  gl_Position = vec4(a_position,0.0,1.0);
  
}