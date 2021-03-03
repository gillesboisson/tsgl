#version 300 es
precision mediump float;


uniform sampler2D u_texture;

in vec2 v_uv;

out vec4 color;


void main(){
  color = texture(u_texture, v_uv);
}



