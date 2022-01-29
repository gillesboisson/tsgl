#version 300 es
precision mediump float;
in vec2 v_uv;

uniform sampler2D u_tex;

layout(location = 0) out vec4 colorOut;

void main(void){
  colorOut = texture(u_tex,v_uv);
  colorOut = vec4(1.0,1.0,1.0,1.0);
}