
precision highp float;

uniform mat4 u_mvpMat;
uniform mat4 u_normalMat;

uniform mat4 u_depthBiasMvpMat;

attribute vec3 a_position;
attribute vec3 a_normal;

varying vec3 v_shadowCoord;
varying vec3 v_normal;

void main(void){
  vec4 position = vec4(a_position,1.0);
  v_shadowCoord = (u_depthBiasMvpMat * position).xyz;
  v_normal = (u_normalMat * vec4(a_normal,1.0)).xyz;

  gl_Position = u_mvpMat * position;
}