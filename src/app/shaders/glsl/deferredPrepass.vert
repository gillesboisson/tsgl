#version 300 es
precision mediump float;


#ifdef NORMAL_TBN
  mat3 tbnMat(
    vec3 normal,
    vec4 tangentSource,
    mat4 normalMat,
    mat4 modelMat
  ){

  // define TBN (Tangent Bitangent Normal) mat
  vec3 tangent = normalize(tangentSource).xyz;
  // apply normal mat (model / cam) to normal
  vec3 normalW = normalize(vec3(normalMat * vec4(normal, 0.0)));
  // apply model mat to tangent
  vec3 tangentW = normalize(vec3(modelMat * vec4(tangent, 0.0)));
  // calc bitangent
  vec3 bitangentW = cross(normalW, tangentW) * tangentSource.w;
  // set the output mat
  return mat3(tangentW, bitangentW, normalW);
}

#endif



in vec3 a_position;
in vec2 a_uv;

uniform mat4 u_modelMat;
uniform mat4 u_mvpMat;


out vec2 v_uv;
out vec3 v_position;

#ifdef NORMAL_VERTEX
in vec3 a_normal;
uniform mat4 u_normalMat;
out vec3 v_normal;
#endif

#ifdef NORMAL_TBN
in vec3 a_normal;
in vec4 a_tangent;
uniform mat4 u_normalMat;

out mat3 v_TBN;

#endif




void main(){
    vec4 position =  vec4(a_position,1.0);
      
    v_uv = a_uv;
    
    v_position = (u_modelMat * vec4(a_position, 1.0)).xyz;

    #ifdef NORMAL_VERTEX
    v_normal = (u_normalMat * vec4(a_normal,1.0)).xyz;
    #endif

    #ifdef NORMAL_TBN
    v_TBN = tbnMat(a_normal,a_tangent, u_normalMat,  u_modelMat);
    #endif

    gl_Position = u_mvpMat * position;


}
