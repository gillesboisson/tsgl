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

// Shader implementation =========================================================================================================

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

  // float facing = step(dot(eyeDirection, ng),0.0) * 2.0 - 1.0;
  // t *= facing;
  // b *= facing;
  // ng *= facing;

  return mat3(t, b, ng) * normalize(normal);
}

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

      vec4 shadowD = texture2D( shadowMap, uv + vec2(f * pixelSize.x / 2.0,i * pixelSize.y / 2.0)  );
      if ( shadowD.x  >=  depth - bias ){
       visibility += 1.0 / SAMPLE_FRAC;
      } 

     
    }
  }

  return visibility;
}


#ifdef DIFFUSE_MAP
uniform sampler2D u_diffuseMap;
#endif

#ifdef DIFFUSE_COLOR
  uniform vec4 u_diffuseColor;
#endif


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

varying vec3 v_position;

varying vec2 v_uv;

#ifdef NORMAL_VERTEX
varying vec3 v_normal;
#endif

#ifdef NORMAL_MAP
uniform sampler2D u_normalMap;
uniform mat4 u_normalMat;

#endif

#ifdef NORMAL_TBN
uniform sampler2D u_normalMap;
uniform mat4 u_normalMat;

varying mat3 v_TBN;
#endif

// occlusion 
#ifdef OCCLUSION_PBR_SPEC_MAP
uniform sampler2D u_pbrMap;
#endif


#ifdef SHADOW_MAP

uniform sampler2D u_shadowMap;
uniform vec2 u_shadowMapPixelSize;
varying vec3 v_shadowCoord;

#endif


void main(){

    // PBR extra map ------------------------------------------------------
    #ifdef OCCLUSION_PBR_SPEC_MAP
    vec4 pbrMap =  texture2D(u_pbrMap,v_uv);
    #endif
   
    // normal mapping ------------------------------------------------------
    #ifdef NORMAL_VERTEX
    vec3 normal = normalize(v_normal); 
    #endif
      
    #ifdef NORMAL_MAP
    vec3 normal = normalize(
        (
          u_normalMat *
          vec4(
            texture2D(u_normalMap,v_uv).rgb * vec3(2.0) - vec3(1.0),
            1.0
          )
        ).xyz

      ); 
    #endif

    #ifdef NORMAL_TBN
     vec3 normal = texture2D(u_normalMap,v_uv).rgb * vec3(2.0) - vec3(1.0);
     vec3 viewDir    = normalize(u_cameraPosition - v_position);

      normal = tbnMatToNormal(v_TBN, normal, viewDir);

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
      v_position,
      normal,
      u_lightDirection,
      u_lightColor,
      u_specularColor,
      u_cameraPosition,
      u_lightShininess
    );

    #ifdef SHADOW_MAP
    float visibility = pcfShadow(u_shadowMap,v_shadowCoord.z,v_shadowCoord.xy,u_shadowMapPixelSize,normal, u_lightDirection);
    color *= visibility;
    #endif
    
    #ifdef DIFFUSE_MAP
    vec4 diffuse = texture2D(u_diffuseMap,v_uv);
    #endif

    #ifdef DIFFUSE_COLOR
    vec4 diffuse = u_diffuseColor;
    #endif


    #ifndef DEBUG
    gl_FragColor = diffuse * (vec4(ambiantColor + color,1.0)) * diffuse.a;
    #endif

    #ifdef DEBUG_NORMAL
    gl_FragColor = vec4( normal * 0.5 + 0.5 ,1.0);
    #endif

    #ifdef DEBUG_OCCLUSION
    #ifdef OCCLUSION_MAP
    gl_FragColor = vec4(vec3(pbrMap.r),1.0);
    #endif
    #endif

    #ifdef DEBUG_SHADOW
    #ifdef SHADOW_MAP
    gl_FragColor = vec4(texture2D(u_shadowMap,v_shadowCoord.xy).xxx,1.0);
    #endif
    #endif


    #ifdef DEBUG_LIGHT_DIFFUSE_SPEC
    gl_FragColor = vec4(color,1.0);
    #endif

    #ifdef DEBUG_LIGHT_AMBIANT
    gl_FragColor = vec4(ambiantColor,1.0);
    #endif
}
