precision mediump float;


// Helpers implementation =========================================================================================================

// Blinn phong 
vec3 blinnPhong(vec3 modelPosition,
 vec3 modelNormal,
 vec3 lightDir,
 vec3 lightColor,
 vec3 specularColor,
 vec3 cameraPosition,
 float shininess){
      
      // calculate base vectors
      vec3 viewDir    = normalize(modelPosition - cameraPosition);
      vec3 halfwayDir = normalize(lightDir + viewDir);
      
      // diffuse

      float diff = max(dot(modelNormal, lightDir), 0.0);
      vec3 diffuse = lightColor * diff;

      // specular
      float spec = max(pow(max(dot(modelNormal, halfwayDir), 0.0), shininess),0.0);
      vec3 specular = specularColor * spec;


      #ifndef DEBUG_LIGHT_DIFFUSE_SPEC
      return specular + diffuse;
      #endif

      #ifdef DEBUG_LIGHT_DIFFUSE
      return diffuse;
      #endif

      #ifdef DEBUG_LIGHT_SPECULAR
      return specular;
      #endif

}



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


// Shader implementation =========================================================================================================

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

#ifdef SHADOW_MAP
varying vec3 v_shadowCoord;
uniform mat4 u_depthBiasMvpMat;
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

    #ifdef SHADOW_MAP
    v_shadowCoord = (u_depthBiasMvpMat * position).xyz;
    #endif

    gl_Position = u_mvpMat * position;
}
