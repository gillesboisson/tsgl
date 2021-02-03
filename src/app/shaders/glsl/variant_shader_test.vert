precision mediump float;

#pragma glslify: lambert = require(./lambert.glsl)

uniform mat4 u_mvpMat;

#ifdef VERTEX_SHADE
uniform vec3 u_lightPos;
uniform vec4 u_color;
uniform mat4 u_mvMat; 

#endif


attribute vec3 a_position;
attribute vec2 a_uv;
attribute vec3 a_normal;

varying vec2 v_uv;
varying vec3 v_position;

#ifdef VERTEX_SHADE
varying vec4 v_vertexColor;
#endif

#ifdef FRAGMENT_SHADE
varying vec3 v_normal;
#endif


void main(void){
  v_uv = a_uv;
  v_position = a_position;

  #ifdef FRAGMENT_SHADE
    v_normal = a_normal;
  #endif

  #ifdef VERTEX_SHADE
    v_vertexColor = vec4((u_color * lambert(u_mvMat,a_position,a_normal,u_lightPos)).rgb,1.0);
  #endif

  
  gl_Position = u_mvpMat * vec4(a_position,1.0);
  
}