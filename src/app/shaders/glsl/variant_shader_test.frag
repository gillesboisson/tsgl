precision mediump float;

#pragma glslify: lambert = require(./lambert.glsl)

uniform mat4 u_mvpMat;

#ifdef FRAGMENT_SHADE
uniform vec3 u_lightPos;
uniform vec4 u_color;
uniform mat4 u_mvMat; 
#endif

varying vec2 v_uv;
varying vec3 v_position;

#ifdef VERTEX_SHADE
varying vec4 v_vertexColor;
#endif

#ifdef FRAGMENT_SHADE
varying vec3 v_normal;
#endif


void main(void){
 
  #ifdef FRAGMENT_SHADE
    gl_FragColor = vec4((u_color * lambert(u_mvMat,v_position,normalize(v_normal),u_lightPos)).rgb,1.0);
  #endif

  #ifdef VERTEX_SHADE
    gl_FragColor = v_vertexColor;
  #endif

  #ifdef EXTRA_COLOR
      gl_FragColor *= vec4(EXTRA_COLOR,1.0) * gl_FragColor.a;
  #endif
}
