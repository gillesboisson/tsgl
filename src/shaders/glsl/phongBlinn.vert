precision mediump float;

#pragma glslify: blinnPhong = require(./includes/blinnPhong.glsl)
#pragma glslify: tbnMat = require(./includes/tbnMat.glsl)


attribute vec3 a_position;
attribute vec2 a_uv;


uniform mat4 u_mvpMat;
// uniform mat4 u_mvMat;
uniform mat4 u_modelMat;


varying vec2 v_uv;
varying vec3 v_position;

#ifdef NORMAL_VERTEX
attribute vec3 a_normal;
uniform mat4 u_normalMat;
varying vec3 v_normal;
#endif

#ifdef NORMAL_TBN
attribute vec3 a_normal;
attribute vec4 a_tangent;
uniform mat4 u_normalMat;

varying mat3 v_TBN;

#endif


void main(){
    v_uv = a_uv;
    
    v_position = (u_modelMat * vec4(a_position, 1.0)).xyz;

    #ifdef NORMAL_VERTEX
    v_normal = (u_normalMat * vec4(a_normal,1.0)).xyz;
    #endif

    #ifdef NORMAL_TBN
    v_TBN = tbnMat(a_normal,a_tangent, u_normalMat,  u_modelMat);
    #endif

    gl_Position = u_mvpMat * vec4(a_position,1.0);
}
