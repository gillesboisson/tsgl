precision  mediump float;

uniform mat4 mvp;

attribute vec3 position;
attribute vec4 color;

varying vec4 vcolor;

void main(){
    //vuv = vec2(uv.x,1.0-uv.y);
    vcolor = color;

    gl_Position = mvp * vec4(position,1.0);
    // gl_Position = vec4(position,1.0);
}
