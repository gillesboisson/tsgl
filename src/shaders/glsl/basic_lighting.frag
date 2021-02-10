precision mediump float;

#pragma glslify: blinnPhong = require(./includes/blinnPhong.glsl)


uniform sampler2D u_textureMap;

#ifdef VERTEX_LIGHTING
varying vec3 v_color;
#endif


#ifdef FRAGMENT_LIGHTING
// cam
uniform vec3 u_cameraPosition;

// light
uniform vec3 u_lightPosition;
uniform vec3 u_lightColor;
uniform float u_lightShininess;

// ambiant
uniform vec3 u_ambiantColor;


varying vec3 v_position;
#endif

#ifdef VERTEX_NORMAL
varying vec3 v_normal;
#endif

#ifdef NORMAL_MAP
uniform sampler2D u_normalMap;
#endif


varying vec2 v_uv;

void main(){


    
    #ifdef VERTEX_LIGHTING
    vec4 color = vec4(v_color,1.0);
    #endif
    
    #ifdef FRAGMENT_LIGHTING
      #ifdef VERTEX_NORMAL
      vec3 normal = normalize(v_normal); 
        v_position;

      #endif

      #ifdef NORMAL_MAP
      vec3 normal = normalize(texture2D(u_normalMap, v_uv).xyz * vec3(2.0) - vec3(1.0))
      #endif

      #def

      vec4 color = vec4(blinnPhong(
        v_position,normal,
        u_lightPosition,
        u_lightColor,
        u_cameraPosition,
        u_lightShininess
      ) + u_ambiantColor,1.0);



    #endif

    vec4 diffuse = texture2D(u_texture,v_uv);

    gl_FragColor = diffuse * color * diffuse.a;

}
