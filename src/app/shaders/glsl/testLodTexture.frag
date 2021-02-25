#version 300 es

precision mediump float;

uniform sampler2D u_texture;

in vec2 v_uv;

out vec4 color;

void main(){


  float ind = float(uint(v_uv.x * 2.0) + uint(v_uv.y * 2.0 ) * uint(2)) + 1.0;


  color = vec4(textureLod(u_texture,v_uv * 2.0,ind).xyz, 1.0);
}



