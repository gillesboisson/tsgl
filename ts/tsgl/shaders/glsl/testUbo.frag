#version 300 es
precision mediump float;

uniform sampler2D textureDiffuse;

in vec4 vcolor;
in vec2 vuv;

out vec4 color;

void main(){
    vec4 tcolor = texture(textureDiffuse,vuv);

    color = tcolor * vcolor * vcolor.a;

}
