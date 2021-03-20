
precision mediump float;

uniform mat4 u_mvp;


attribute vec3 a_position;
attribute vec4 a_color;

varying vec4 v_color;
varying vec3 v_position;

void main(void){
  v_color = a_color;
  v_position = a_position;

  gl_Position = u_mvp * vec4(a_position,1.0);
  
}