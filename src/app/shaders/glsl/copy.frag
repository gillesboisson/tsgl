#version 300 es
precision mediump float;


uniform sampler2D u_texture;
uniform float u_textureLod;

in vec2 v_uv;

out vec4 color;


void main(){
  color = textureLod(u_texture, v_uv, u_textureLod);
}



