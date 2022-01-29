
precision highp float;

uniform mat4 u_mvpMat;
attribute vec3 a_position;

void main(void){
  gl_Position = u_mvpMat * vec4(a_position,1.0);
}