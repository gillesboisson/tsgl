
precision mediump float;

uniform mat4 mvpMat;


attribute vec3 position;
attribute vec2 uv;

varying vec2 v_uv;
varying vec3 v_position;

void main(void){
  v_uv = uv;
  v_position = position;

  gl_Position = vec4(position,1.0);
  
}