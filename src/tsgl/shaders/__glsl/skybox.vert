precision mediump float;

uniform mat4 u_mvpMap;

attribute vec3 a_position;

varying vec3 v_position;

void main(){
    v_position = a_position;
    gl_Position = u_mvpMap * vec4(a_position,1.0);
}
