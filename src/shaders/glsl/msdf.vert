

precision mediump float;

uniform mat4 mvp;
attribute vec2 position;
attribute vec2 uv;
attribute vec4 color;

varying vec4 vcolor;
varying vec2 vuv;

void main(){
    //vuv = vec2(uv.x,1.0-uv.y);
    vuv = uv;
    vcolor = color;

    gl_Position = mvp * vec4(position,0.0,1.0);
}
