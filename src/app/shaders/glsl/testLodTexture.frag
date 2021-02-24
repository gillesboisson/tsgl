#version 300 es

precision mediump float;

uniform sampler2D u_texture;

in vec2 v_uv;

out vec4 color;

void main(){
  color = vec4(textureLod(u_texture,v_uv,0.5).xyz, 1.0);
}



