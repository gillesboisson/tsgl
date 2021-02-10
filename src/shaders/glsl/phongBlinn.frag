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


varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_uv;

void main(){
    vec3 normal = normalize(v_normal); 
      v_position;

    vec4 color = vec4(blinnPhong(
      v_position,
      normal,
      u_lightPosition,
      u_lightColor,
      u_specularColor,
      u_cameraPosition,
      u_lightShininess
    ) + u_ambiantColor,1.0);

    vec4 diffuse = texture2D(u_diffuseMap,v_uv);

    // gl_FragColor = diffuse * color * diffuse.a;
    gl_FragColor = vec4(color.rgb,1.0);
}
