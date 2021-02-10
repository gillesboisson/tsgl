precision mediump float;

#pragma glslify: blinnPhong = require(./includes/blinnPhong.glsl)

uniform mat4 u_mvpMat;


attribute vec2 a_position;
attribute vec2 a_uv;

#ifdef VERTEX_NORMAL
uniform mat4 u_normalMat;
uniform mat4 u_mvMat;

attribute vec3 a_normal;
#endif

#ifdef VERTEX_LIGHTING

// cam
uniform vec3 u_cameraPosition;

// light
uniform vec3 u_lightPosition;
uniform vec3 u_lightColor;
uniform float u_lightShininess;

// ambiant
uniform vec3 u_ambiantColor;

varying vec3 v_color;
#endif


#ifdef FRAGMENT_LIGHTING
varying vec3 v_normal;
varying vec3 v_position;
#endif


varying vec2 v_uv;

void main(){
    v_uv = a_uv;
    
    vec3 modelPosition = (u_mvMat * vec4(position, 1.0)).xyz;
    
    #ifdef FRAGMENT_LIGHTING
    v_position = modelPosition;
    #endif


    #ifdef VERTEX_NORMAL
    vec3 normal = (u_normalMat * vec4(a_normal,1.0)).xyz
   

    #ifdef FRAGMENT_LIGHTING
    v_normal = normal 
    #endif

    #ifdef VERTEX_LIGHTING
      
      
      v_color = blinnPhong(
        modelPosition,normal,
        u_lightPosition,
        u_lightColor,
        u_cameraPosition,
        u_lightShininess
      ) + u_ambiantColor;

    #endif

    #endif

    gl_Position = u_mvp * vec4(a_position,0.0,1.0);
}
