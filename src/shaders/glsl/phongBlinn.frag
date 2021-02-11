precision mediump float;

#pragma glslify: blinnPhong = require(./includes/blinnPhong.glsl)


uniform sampler2D u_diffuseMap;

// cam
uniform vec3 u_cameraPosition;

// light
uniform vec3 u_lightPosition;
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

// occlusion 
#ifdef OCCLUSION_PBR_SPEC_MAP
uniform sampler2D u_pbrMap;
#endif



void main(){

    #ifdef OCCLUSION_PBR_SPEC_MAP
    vec4 pbrMap =  texture2D(u_pbrMap,v_uv);
    #endif

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

    #ifdef AMBIANT_COLOR
    vec3 ambiantColor = u_ambiantColor;
    #endif 

    #ifdef AMBIANT_IRRADIANCE
    vec3 ambiantColor = textureCube(u_irradianceMap,normal).xyz * u_ambiantColor;
    #endif

  
    #ifdef OCCLUSION_MAP
    ambiantColor *= pbrMap.r;
    #endif

    vec4 color = vec4(blinnPhong(
      v_position,
      normal,
      u_lightPosition,
      u_lightColor,
      u_specularColor,
      u_cameraPosition,
      u_lightShininess
    ) + ambiantColor,1.0);
    

    vec4 diffuse = texture2D(u_diffuseMap,v_uv);

    gl_FragColor = diffuse * color * diffuse.a;
    // gl_FragColor = diffuse * color * diffuse.a;
    // #ifdef OCCLUSION_MAP
    // gl_FragColor = vec4(pbrMap.r);
    // #endif
}
