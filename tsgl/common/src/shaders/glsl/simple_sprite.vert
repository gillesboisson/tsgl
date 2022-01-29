precision mediump float;

uniform mat4 u_mvp;

attribute vec2 a_position;
attribute vec2 a_uv;

varying vec4 v_color;
varying vec2 v_uv;

void main(){
    v_uv = a_uv;
    gl_Position = u_mvp * vec4(a_position,0.0,1.0);
}
