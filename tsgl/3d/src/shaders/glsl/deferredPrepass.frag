#version 300 es
precision mediump float;

vec3 tbnMatToNormal(
  mat3 tbnMat,
  vec3 normal,
  vec3 eyeDirection
){

  vec3 t, b, ng;

  // TBN split
  t = normalize(tbnMat[0]);
  b = normalize(tbnMat[1]);
  ng = normalize(tbnMat[2]);

  return mat3(t, b, ng) * normalize(normal);
}


layout (location = 0) out vec4 AlbedoSpec;
layout (location = 1) out vec4 Position;
layout (location = 2) out vec4 Normal;
layout (location = 3) out vec4 Pbr;

#ifdef PBR_ENABLED

#define EMISSIVE_LOCATION 4
#else
#define EMISSIVE_LOCATION 3
#endif

// layout (location = 3) out vec4 Extra;

uniform sampler2D texture_diffuse1;
uniform sampler2D texture_specular1;

in vec4 v_position;
in vec2 v_uv;

uniform vec3 u_cameraPosition;


#ifdef DIFFUSE_MAP
uniform sampler2D u_diffuseMap;
#endif

#ifdef DIFFUSE_COLOR
  uniform vec4 u_diffuseColor;
#endif


#ifdef NORMAL_VERTEX
in vec3 v_normal;
#endif

#ifdef NORMAL_MAP
uniform sampler2D u_normalMap;
uniform mat4 u_normalMat;

#endif

#ifdef NORMAL_TBN
uniform sampler2D u_normalMap;
uniform mat4 u_normalMat;

in mat3 v_TBN;
#endif

#ifdef PBR_MAP
uniform sampler2D u_pbrMap;
#endif

#ifdef PBR_ENABLED
uniform vec4 u_pbr;
#endif

#ifdef OCCLUSION_MAP
#ifdef OCCLUSION_ONLY
uniform sampler2D u_occlusionMap;
#endif
#endif

#ifdef EMISSIVE_ENABLED
layout (location = EMISSIVE_LOCATION) out vec4 Emissive;
uniform vec3 u_emissiveColor;

#ifdef EMISSIVE_MAP
uniform sampler2D u_emissiveMap;

#endif
#endif

void main(){

  // normal mapping ------------------------------------------------------
  #ifdef NORMAL_VERTEX
  vec3 normal = normalize(v_normal); 
  #endif
    
  #ifdef NORMAL_MAP
  vec3 normal = normalize(
    (
      u_normalMat *
      vec4(
        texture(u_normalMap,v_uv).rgb * vec3(2.0) - vec3(1.0),
        1.0
      )
    ).xyz

  ); 
  #endif

  #ifdef NORMAL_TBN
    vec3 normal = texture(u_normalMap,v_uv).rgb * vec3(2.0) - vec3(1.0);
    vec3 viewDir    = normalize(u_cameraPosition - v_position.xyz);

    normal = tbnMatToNormal(v_TBN, normal, viewDir);

  #endif

  #ifdef DIFFUSE_MAP
  AlbedoSpec.rgb = texture(u_diffuseMap,v_uv).rgb;
  #endif

  #ifdef DIFFUSE_COLOR
  AlbedoSpec.rgb = u_diffuseColor.rgb;
  #endif

  #ifdef PBR_ENABLED
  #ifdef PBR_MAP
  vec4 pbr =  texture(u_pbrMap,v_uv);
  #endif

  #ifdef PBR_VAL
  vec4 pbr =  u_pbr;
  #endif
  
  #ifdef OCCLUSION_MAP
  #ifdef OCCLUSION_PBR
  float ao = pbr.x;
  #else
  float ao = texture(u_occlusionMap,v_uv).x;
  #endif
  #else
  float ao = u_pbr.x;
  #endif

  Pbr=vec4(ao,pbr.y ,pbr.z,1.0);
  #endif

    
  #ifdef EMISSIVE_ENABLED
  #ifdef EMISSIVE_MAP
  Emissive = vec4(texture(u_emissiveMap,v_uv).rgb * u_emissiveColor,1.0);
  #endif
  
  #ifdef EMISSIVE_VAL
  Emissive = vec4(u_emissiveColor, 1.0);
  #endif
  
  #endif


  // store the fragment position vector in the first gbuffer texture
  Position = v_position;
  // also store the per-fragment normals into the gbuffer
  Normal = vec4(normal,1.0);
  // and the diffuse per-fragment color
  // AlbedoSpec.rgb = texture(texture_diffuse1, v_uv).rgb;
  // store specular intensity in gAlbedoSpec's alpha component
  AlbedoSpec.a = 1.0;
}