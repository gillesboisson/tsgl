precision mediump float;

uniform mat4 mvp;
attribute vec2 position;
attribute vec2 uv;

varying vec4 vcolor;
varying vec2 vuv;

void main(){
    vuv = uv;
    gl_Position = mvp * vec4(position,0.0,1.0);
}
