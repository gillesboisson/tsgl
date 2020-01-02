uniform mat4 mvp;
attribute vec3 position;
attribute vec4 color;

varying vec4 vcolor;

void main(){
    vcolor = color;

    gl_Position = mvp * vec4(position,1.0);
}
