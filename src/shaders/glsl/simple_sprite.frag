precision mediump float;

uniform mat4 mvp;
uniform sampler2D texture;

varying vec2 vuv;

void main(){
    gl_FragColor = texture2D(texture,vuv);
}
