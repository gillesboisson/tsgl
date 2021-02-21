precision mediump float;

#pragma glslify: distributionGGX = require(./includes/distributionGGX.glsl)
#pragma glslify: fresnelSchlick = require(./includes/fresnelSchlick.glsl)
#pragma glslify: geometrySmith = require(./includes/geometrySmith.glsl)

const float PI = 3.14159265359;

// material
uniform vec3  u_albedo;
uniform float u_metallic;
uniform float u_roughness;
uniform float u_ao;

// light
uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;

// cam
uniform vec3 u_cameraPosition;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_position;


void main(){

  // normal
  vec3 N = normalize(v_normal);

  // view direction
  vec3 V = normalize(u_cameraPosition - v_position);

  vec3 F0 = vec3(0.04); 
  F0 = mix(F0, u_albedo, u_metallic);

  // reflectance equation
  vec3 Lo = vec3(0.0);

  // calculate per-light radiance
  // vec3 L = normalize(lightPositions[i] - WorldPos);
  vec3 L = u_lightDirection;


  vec3 H = normalize(V + L);
  vec3 radiance = u_lightColor;

  // cook-torrance brdf
  float NDF = distributionGGX(N, H, u_roughness);        
  float G   = geometrySmith(N, V, L, u_roughness);      
  vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);     

  // specular contribution
  vec3 kS = F;
  vec3 kD = vec3(1.0) - kS;
  kD *= 1.0 - u_metallic;	  

  vec3 numerator    = NDF * G * F;
  float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);
  vec3 specular     = numerator / max(denominator, 0.001);  
      
  // add to outgoing radiance Lo
  float NdotL = max(dot(N, L), 0.0);                
  Lo += (kD * u_albedo / PI + specular) * radiance * NdotL; 

  vec3 ambient = vec3(0.03) * u_albedo * u_ao;
  vec3 color = ambient + Lo;

  color = color / (color + vec3(1.0));
  color = pow(color, vec3(1.0/2.2));  

  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(u_lightDirection / 2.0 + 0.5,1.0);
  // gl_FragColor = vec4(vec3(Lo),1.0);
}