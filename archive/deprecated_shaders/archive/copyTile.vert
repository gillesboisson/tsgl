precision mediump float;

attribute vec2 position;
attribute vec2 uv;

varying vec2 vuv;

void main(){
    vuv = uv;
    gl_Position = vec4(position,0.0,1.0);
}
