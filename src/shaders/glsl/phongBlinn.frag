precision mediump float;

#pragma glslify: blinnPhong = require(./includes/blinnPhong.glsl)
#pragma glslify: tbnMatToNormal = require(./includes/tbnMatToNormal.glsl)


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
    
    #ifdef DIFFUSE_MAP
    vec4 diffuse = texture2D(u_diffuseMap,v_uv);
    #endif

    #ifdef DIFFUSE_COLOR
    vec4 diffuse = u_diffuseColor;
    #endif

    gl_FragColor = diffuse * (vec4(ambiantColor + color,1.0)) * diffuse.a;


    // #ifdef NORMAL_TBN
    // gl_FragColor = vec4(normal * vec3(0.5) + vec3(0.5),1.0);
    // #endif

    // gl_FragColor = diffuse * color * diffuse.a;
    // #ifdef OCCLUSION_MAP
    // gl_FragColor = vec4(pbrMap.r);
    // #endif
}
