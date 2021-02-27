#version 300 es
precision mediump float;


in vec3 v_normal;

uniform samplerCube u_texture;

uniform float u_lod;

out vec4 FragColor;

void main(void){
  
  // position becomes normal
  vec3 normal = normalize(v_normal);

  vec4 color = textureLod(
    u_texture,
    normal,
    u_lod
    );


  FragColor = color;

}