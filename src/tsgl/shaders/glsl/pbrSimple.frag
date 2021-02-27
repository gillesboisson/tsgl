#version 300 es
precision mediump float;


const float PI = 3.14159265359;
const float MAX_REFLECTION_LOD = 4.0;

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

in vec2 v_uv;
in vec3 v_normal;
in vec3 v_position;

uniform sampler2D u_brdfLut;
uniform samplerCube u_irradianceMap;
uniform samplerCube u_reflexionMap;

out vec4 FragColor;

vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness)
{
  return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
}   

void main(){


  float roughness =  u_roughness + 0.001; // division / 0 fix 
 
  // normal
  vec3 N = normalize(v_normal);

  // view direction
  vec3 V = normalize(u_cameraPosition - v_position);

  vec3 R = reflect(-V, N);   
  
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
  float NDF = distributionGGX(N, H, roughness);        
  float G   = geometrySmith(N, V, L, roughness);      
  vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);     


  // vec3 ambient = texture(u_irradianceMap, N).rgb;

  vec3 kS = fresnelSchlickRoughness(max(dot(N, V), 0.0), F0, roughness); 
  vec3 kD = 1.0 - kS;
  kD *= 1.0 - u_metallic;	  


  vec3 irradiance = texture(u_irradianceMap, N).rgb;
  vec3 diffuse    = irradiance * u_albedo;
  
  
  // vec3 numerator    = NDF * G * F;
  // float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);
  // vec3 specular     = numerator / max(denominator, 0.001); 

  vec3 prefilteredColor = textureLod(u_reflexionMap, R,  roughness * MAX_REFLECTION_LOD).rgb;   
  vec2 envBRDF  = texture(u_brdfLut, vec2(max(dot(N, V), 0.0), roughness)).rg;
  vec3 specular = prefilteredColor * (F * envBRDF.x + envBRDF.y); 
  
  
  vec3 ambient    = (kD * diffuse + specular) * u_ao; 

  // specular contribution
  // vec3 kS = F;
  // vec3 kD = vec3(1.0) - kS;


  

      
  // add to outgoing radiance Lo
  float NdotL = max(dot(N, L), 0.0);                
  Lo += (kD * u_albedo / PI + specular) * irradiance * NdotL; 

  vec3 color = ambient + Lo;

  color = color / (color + vec3(1.0));
  color = pow(color, vec3(1.0/2.2));  

  FragColor = vec4(color, 1.0);
  // FragColor = vec4(u_metallic,roughness,0,1.0);
  // FragColor = vec4(vec3(Lo),1.0);
}