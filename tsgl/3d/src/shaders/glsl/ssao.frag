#version 300 es
precision mediump float;

uniform mat4 u_pMat;
uniform mat4 u_vMat;

uniform sampler2D u_normalMap;
uniform sampler2D u_positionMap;
uniform sampler2D u_depthMap;

uniform sampler2D u_ssaoRotationMap;

uniform vec3 u_ssaoSamples[64];
//

uniform vec4 u_settings;
uniform int u_kernelSize;

uniform vec2 u_noiseScale;

in vec2 v_uv;



out vec4 FragColor;




// const vec2 u_noiseScale = vec2(1920.0/4.0, 1080.0/4.0); // screen = 800x600

// const float bias = 0.05;
// const float radius = 0.5;
// const float power = 1.0;

void main(){
  vec3 fragPos   = texture(u_positionMap, v_uv).xyz;
  
  float radius = u_settings.x;
  float power = u_settings.y;
  float bias = u_settings.z;
  
  // fragPos = (u_vMat * vec4(fragPos,1.0)).xyz;

  vec3 normal    = texture(u_normalMap, v_uv).rgb;
  vec3 randomVec = texture(u_ssaoRotationMap, v_uv * u_noiseScale).xyz;  

  vec3 tangent   = normalize(randomVec - normal * dot(randomVec, normal));
  vec3 bitangent = cross(normal, tangent);
  mat3 TBN       = mat3(tangent, bitangent, normal);  


  float occlusion = 0.0;
  for(int i = 0; i < 64; ++i)
  {
      // get sample position
      vec3 samplePos = TBN * u_ssaoSamples[i]; // from tangent to view-space
      samplePos = fragPos + samplePos * radius; 
      
      vec4 offset = vec4(samplePos, 1.0);
      offset      = u_pMat * offset;    // from view to clip-space
      offset.xyz /= offset.w;               // perspective divide
      offset.xyz  = offset.xyz * 0.5 + 0.5; // transform to range 0.0 - 1.0  

      // vec4 sampleFPos =  vec4(texture(u_positionMap, v_uv).xyz, 1.0);
      float sampleDepth = texture(u_positionMap, offset.xy).z;

      // occlusion += (sampleDepth >= samplePos.z + bias ? 1.0 : 0.0);  

      float rangeCheck = smoothstep(0.0, 1.0, radius / abs(fragPos.z - sampleDepth));
      occlusion       += (sampleDepth >= samplePos.z + bias ? 1.0 : 0.0) * rangeCheck; 

  } 

  //vec4 test = u_pMat * offset;
  
  occlusion = min(1.0 - (occlusion / 64.0), 1.0);


  // FragColor = vec4(pow(occlusion, power));
  // FragColor = texture(u_normalMap, v_uv);

  FragColor = vec4(1.0,1.0,0.0,1.0);
  // FragColor = vec4(tangent / 2.0 + 0.5,1.0);

}


// void main(){
//   // float radius = u_settings.x;
//   // float power = u_settings.y;
//   //float kernelSize = u_settings.z;
  
//   float radius = 16.0;
//   float power = 2.0;

//   vec3 fragPos   = (u_vMat * vec4(texture(u_positionMap, v_uv).xyz, 1.0)).xyz;
//   vec3 normal    = texture(u_normalMap, v_uv).rgb;
//   vec3 randomVec = texture(u_ssaoRotationMap, v_uv * u_noiseScale).xyz;  

//   vec3 tangent   = normalize(randomVec - normal * dot(randomVec, normal));
//   vec3 bitangent = cross(normal, tangent);
//   mat3 TBN       = mat3(tangent, bitangent, normal);




//   float occlusion = 0.0;
//   for(int i = 0; i < u_kernelSize; ++i)
//   {
//       // get sample position
//       vec3 samplePos = TBN * u_ssaoSamples[i]; // from tangent to view-space
//       samplePos = fragPos + samplePos * radius; 
      
//       vec4 offset = vec4(samplePos, 1.0);
//       offset      = u_pMat * offset;    // from view to clip-space
//       offset.xyz /= offset.w;               // perspective divide
//       offset.xyz  = offset.xyz * 0.5 + 0.5; // transform to range 0.0 - 1.0  

//       float sampleDepth = (u_vMat * vec4(texture(u_positionMap, offset.xy).xyz, 1.0)).z; 

//       occlusion += (sampleDepth >= samplePos.z + bias ? 1.0 : 0.0); 

     
     

//   }  

//   vec3 samplePos = TBN * u_ssaoSamples[0]; // from tangent to view-space
//    occlusion = 1.0 - (occlusion / 16.0);
//   //  FragColor = vec4(occlusion);
//    FragColor = vec4(samplePos * 0.5 + 0.5,1.0);
//   //  FragColor = vec4(fragPos.xyz,1.0);
//   //  FragColor = vec4(u_ssaoSamples[0] * 100.0,1.0);
// }