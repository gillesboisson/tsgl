#version 300 es
precision mediump float;

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


// BlinnPhong
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

// PCF Shadow
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


// cam
uniform vec3 u_cameraPosition;

// light
uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;
uniform float u_lightShininess;

// ambiant

uniform vec3 u_ambiantColor;

#ifdef AMBIANT_IRRADIANCE
uniform samplerCube u_irradianceMap;
#endif

#ifdef SHADOW_MAP
uniform sampler2D u_shadowMap;
uniform vec2 u_shadowMapPixelSize;
uniform mat4 u_depthBiasMvpMat;
#endif

// deferred data
uniform sampler2D u_textureMap;
uniform sampler2D u_normalMap;
uniform sampler2D u_positionMap;
uniform sampler2D u_depthMap;

in vec2 v_uv;

out vec4 Frag_color;


void main(){
  vec4 diffuse = texture(u_textureMap, v_uv);
  vec3 normal = texture(u_normalMap, v_uv).xyz;
  vec3 position = texture(u_positionMap, v_uv).rgb;
  float depth = texture(u_depthMap, v_uv).r;

  // PBR extra map ------------------------------------------------------
  #ifdef OCCLUSION_PBR_SPEC_MAP
  vec4 pbrMap =  texture(u_pbrMap,v_uv);
  #endif
  
  // ambiant mapping ------------------------------------------------------

  #ifdef AMBIANT_COLOR
  vec3 ambiantColor = u_ambiantColor;
  #endif 

  #ifdef AMBIANT_IRRADIANCE
  vec3 ambiantColor = textureCube(u_irradianceMap,normal).xyz * u_ambiantColor;
  #endif

  #ifdef OCCLUSION_PBR_SPEC_MAP  
  #ifdef OCCLUSION_MAP
  ambiantColor *= pbrMap.r;
  #endif
  #endif

  vec3 color = blinnPhong(
    position,
    normal,
    u_lightDirection,
    u_lightColor,
    u_specularColor,
    u_cameraPosition,
    u_lightShininess
  );

  #ifdef SHADOW_MAP
  vec3 shadowCoords = (u_depthBiasMvpMat * vec4(position,1.0)).xyz;
  float visibility = pcfShadow(u_shadowMap,shadowCoords.z,shadowCoords.xy,u_shadowMapPixelSize,normal, u_lightDirection);
  color *= visibility;
  #endif
    
  

  #ifndef DEBUG
  Frag_color = diffuse * (vec4(ambiantColor + color,1.0)) * diffuse.a;
  #endif

  #ifdef DEBUG_NORMAL
  Frag_color = vec4( normal * 0.5 + 0.5 ,1.0);
  #endif

  #ifdef DEBUG_OCCLUSION
  #ifdef OCCLUSION_MAP
  Frag_color = vec4(vec3(pbrMap.r),1.0);
  #endif
  #endif

  #ifdef DEBUG_SHADOW
  #ifdef SHADOW_MAP
  Frag_color = vec4(texture(u_shadowMap,v_shadowCoord.xy).xxx,1.0);
  #endif
  #endif


  #ifdef DEBUG_LIGHT_DIFFUSE_SPEC
  Frag_color = vec4(color,1.0);
  #endif

  #ifdef DEBUG_LIGHT_AMBIANT
  Frag_color = vec4(ambiantColor,1.0);
  #endif
}
