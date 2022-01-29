#version 300 es
precision mediump float;

const float PI = 3.14159265359;
const float MAX_REFLECTION_LOD = 4.0;

// Helpers ====================================================================================

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


// Shadows functions ====================================================================================

#ifndef SAMPLE_SIZE
#define SAMPLE_SIZE 5.0
#endif

#ifndef SAMPLE_FRAC
#define SAMPLE_FRAC 25.0
#endif

#ifndef BASE_BIAS
#define BASE_BIAS 0.005
#endif


#define SAMPLE_MAX (SAMPLE_SIZE - 1.0) / 2.0
#define SAMPLE_MIN -SAMPLE_MAX


float pcfShadow(in sampler2D shadowMap,float depth,in vec2 uv,in vec2 pixelSize,in vec3 normal,in vec3 lightDirection ){
  
  if(uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0){
    return 1.0;
  }
  
  float visibility = 0.0;


  float cosTheta = dot(normal, lightDirection);
  
  float bias = BASE_BIAS*tan(acos(cosTheta));
  if(bias > 0.01) bias = 0.01;
  if(bias < 0.0) bias = 0.0;

  for(float i = SAMPLE_MIN; i <= SAMPLE_MAX ; i++){
    for(float f = SAMPLE_MIN; f <= SAMPLE_MAX ; f++){

      vec4 shadowD = texture( shadowMap, uv + vec2(f * pixelSize.x / 2.0,i * pixelSize.y / 2.0)  );
      if ( shadowD.x  >=  depth - bias ){
       visibility += 1.0 / SAMPLE_FRAC;
      } 

     
    }
  }

  return visibility;
}


// PBR functions ============================================================================

float distributionGGX(vec3 N, vec3 H, float a)
{
    float a2     = a*a;
    float NdotH  = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;
	
    float nom    = a2;
    float denom  = (NdotH2 * (a2 - 1.0) + 1.0);
    denom        = PI * denom * denom;
	
    return nom / denom;
}

vec3 fresnelSchlick(float cosTheta, vec3 F0)
{
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

float geometrySchlickGGX(float NdotV, float k)
{
    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;
	
    return nom / denom;
}
  
// N : normal
// V : View direction
// L : light direction
// k : remapped roughness (direct or IBL)
float geometrySmith(vec3 N, vec3 V, vec3 L, float k)
{
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx1 = geometrySchlickGGX(NdotV, k);
    float ggx2 = geometrySchlickGGX(NdotL, k);
	
    return ggx1 * ggx2;
}

vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness)
{
  return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
}  


// Shader declaration ============================================================================



#ifdef DIFFUSE_MAP
  uniform sampler2D u_textureMap;
#endif

#ifdef DIFFUSE_COLOR
  uniform vec4 u_diffuseColor;
#endif


// cam
uniform vec3 u_cameraPosition;


// probes data
uniform samplerCube u_irradianceMap;
uniform samplerCube u_reflexionMap;
uniform sampler2D u_brdfLut;


uniform vec3 u_lightDirection;


in vec3 v_position;
in vec2 v_uv;

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

// pbr 
#ifdef PBR_MAP
uniform sampler2D u_pbrMap;
#endif

uniform vec4 u_pbr;

#ifdef SHADOW_MAP

uniform sampler2D u_shadowMap;
uniform vec2 u_shadowMapPixelSize;
in vec3 v_shadowCoord;

#endif


#ifdef OCCLUSION_MAP
#ifdef OCCLUSION_ONLY
uniform sampler2D u_occlusionMap;
#endif
#endif

#ifdef EMISSIVE_MAP

uniform sampler2D u_emissiveMap;
uniform vec3 u_emissive;
#endif

#ifdef GAMMA_CORRECTION

uniform vec2 u_gammaExposure;

#endif

out vec4 FragColor;





void main(){
  vec3 V = normalize(u_cameraPosition - v_position);  // View direction
  vec3 L = u_lightDirection;                          // Light direction
  vec3 H = normalize(V + L);                          // Half vector view light


  // normal variants ------------------------------------------------------

  #ifdef NORMAL_VERTEX
  vec3 N = normalize(v_normal); 
  #endif
    
  #ifdef NORMAL_MAP
  vec3 N = normalize(
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
    vec3 N = texture(u_normalMap,v_uv).rgb * vec3(2.0) - vec3(1.0);
    N = tbnMatToNormal(v_TBN, N, V);
  #endif

  vec3 R = reflect(-V, N); 


  // Shadow ---------------------------------------------------------------

  #ifdef SHADOW_MAP
  float visibility = pcfShadow(u_shadowMap,v_shadowCoord.z,v_shadowCoord.xy,u_shadowMapPixelSize,N, L);
  #endif

  #ifndef SHADOW_MAP
  const float visibility = 1.0;
  #endif 
  
  
  // PBR data variants  ------------------------------------------------------
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


 
  
  float roughness = pbr.y;
  float metallic = pbr.z;

  // albedo data variants  ------------------------------------------------------
  
  #ifdef DIFFUSE_MAP
  vec4 diffuseColor =  texture(u_textureMap,v_uv);
  vec3 albedo = diffuseColor.rgb;
  #endif

  #ifdef DIFFUSE_COLOR
  vec4 diffuseColor = u_diffuseColor;
  vec3 albedo = diffuseColor.rgb;
  #endif

  // PBR ------------------------------------------------------------------------

  // init
  vec3 F0 = vec3(0.04); 
  F0 = mix(F0, albedo, metallic);
    
  vec3 Lo = vec3(0.0);

  // cook-torrance brdf
  float NDF = distributionGGX(N, H, roughness);        
  float G   = geometrySmith(N, V, L, roughness);      
  vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);     

  // fresnels schlick roughness
  vec3 kS = fresnelSchlickRoughness(max(dot(N, V), 0.0), F0, roughness); 
  vec3 kD = 1.0 - kS;
  kD *= 1.0 - metallic;

  // irradiance
  vec3 irradiance = texture(u_irradianceMap, N).rgb;
  vec3 diffuse    = irradiance * albedo;

  // reflectance / specular
  vec3 prefilteredColor = textureLod(u_reflexionMap, R,  roughness * MAX_REFLECTION_LOD).rgb;   
  vec2 envBRDF  = texture(u_brdfLut, vec2(max(dot(N, V), 0.0), roughness)).rg;
  vec3 specular = prefilteredColor * (F * envBRDF.x + envBRDF.y); 

  // ambiant
  vec3 ambient    = (kD * diffuse + specular) * ao; 

  float NdotL = max(dot(N, L), 0.0);                
  Lo += (kD * albedo / PI + specular) * irradiance * NdotL; 


  vec3 color = ambient + Lo * visibility;
  // color = color / (color + vec3(1.0));
  // color = pow(color, vec3(1.0/2.2));  


  #ifdef EMISSIVE_MAP
  vec3 emissiveColor = texture(u_emissiveMap,v_uv).rgb * u_emissive;
  color += emissiveColor;
  #endif

  // gamme correction

  #ifdef GAMMA_CORRECTION
    // exposure tone mapping
    color = vec3(1.0) - exp(-color * u_gammaExposure.x);
    // gamma correction d
    color = pow(color, vec3(1.0 / u_gammaExposure.y));
  
  #endif

  #ifndef DEBUG 
  FragColor = vec4(color, 1.0);
  #endif




  #ifdef DEBUG_NORMAL
  FragColor = vec4( N * 0.5 + 0.5 ,1.0);
  #endif
  
  #ifdef DEBUG_DIFFUSE
  FragColor = vec4(diffuse ,1.0);
  #endif

    #ifdef DEBUG_SPECULAR
  FragColor = vec4(specular ,1.0);
  #endif

  #ifdef DEBUG_AMBIANT
  FragColor = vec4(ambient ,1.0);
  #endif





  #ifdef DEBUG_OCCLUSION
  FragColor = vec4(vec3(ao) ,1.0);
  #endif


  #ifdef DEBUG_METALLIC
  FragColor =  vec4(vec3(metallic) ,1.0);
  #endif

  #ifdef DEBUG_ROUGHNESS
  FragColor =  vec4(vec3(roughness) ,1.0);
  #endif

  #ifdef DEBUG_SHADOW
  #ifdef SHADOW_MAP
  FragColor = vec4(vec3(visibility),1.0);
  #endif
  #endif

  #ifdef DEBUG_EMISSIVE
  #ifdef EMISSIVE_ENABLED
  FragColor = vec4(emissiveColor,1.0);
  #endif
  #endif


}
