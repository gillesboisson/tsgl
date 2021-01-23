#version 300 es
precision mediump float;
in vec2 vUv;

uniform sampler2D tex;

layout(location = 0) out vec4 colorOut;

void main(void){
  colorOut = texture(tex,vUv);
}