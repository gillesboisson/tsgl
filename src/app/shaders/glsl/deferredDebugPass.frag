#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform sampler2D u_normalMap;
uniform sampler2D u_positionMap;
uniform sampler2D u_depthMap;

uniform vec2 u_pixelSize;

in vec2 v_uv;

out vec4 Frag_color;



void main(){
  vec4 color = texture(u_texture, v_uv);
  vec3 normal = texture(u_normalMap, v_uv).xyz;
  vec3 position = texture(u_positionMap, v_uv).rgb;
  float depth = texture(u_depthMap, v_uv).r;
  
  Frag_color = vec4(position,1.0);
}

