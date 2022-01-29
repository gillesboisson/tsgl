#version 300 es
precision mediump float;

#define PI 3.14159265359

uniform samplerCube u_texture;

in vec3 v_normal;

out vec4 FragColor;

void main()
{		

  vec3 irradiance = vec3(0.0);  
  vec3 normal = normalize(v_normal);

  vec3 up    = vec3(0.0, 1.0, 0.0);
  vec3 right = cross(up, normal);
  up         = cross(normal, right);
  
  float sampleDelta = 0.025;
  float nrSamples = 0.0; 
  for(float phi = 0.0; phi < 2.0 * PI; phi += sampleDelta)
  {
      for(float theta = 0.0; theta < 0.5 * PI; theta += sampleDelta)
      {
          // spherical to cartesian (in tangent space)
          vec3 tangentSample = vec3(sin(theta) * cos(phi),  sin(theta) * sin(phi), cos(theta));
          // tangent space to world
          vec3 sampleVec = tangentSample.x * right + tangentSample.y * up + tangentSample.z * normal; 

          irradiance += texture(u_texture, sampleVec).rgb * cos(theta) * sin(theta);
          nrSamples++;
      }
  }
  irradiance = PI * irradiance * (1.0 / float(nrSamples));

    
  FragColor = vec4(irradiance, 1.0);
}