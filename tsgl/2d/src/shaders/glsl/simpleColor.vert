precision mediump float;
// uniform mat4 mvp;
attribute vec3 position;
attribute vec2 uv;
// attribute vec4 colors;

// varying vec4 vcolor;
varying vec2 vuv;

void main(){
    //vuv = vec2(uv.x,1.0-uv.y);
    vuv = uv;
    // vcolor = colors;
    gl_Position = vec4(position, 1.0);
}
