#version 300 es
precision mediump float;


layout (location = 0) out vec4 FragColor;

uniform sampler2D u_texture;

in vec2 v_uv;

void main() 
{
  FragColor = texture(u_texture,v_uv);
}