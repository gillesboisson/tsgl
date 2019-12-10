precision mediump float;

attribute vec2 iposition;
attribute vec2 ivelocity;

void main(){
    gl_Position = vec4(iposition,0.5,1.0);
    gl_PointSize = 3.0;
}
