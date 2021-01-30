precision mediump float;

uniform sampler2D texture;

varying vec2 vuv;

void main(){
    vec4 tcolor = texture2D(texture,vuv);
    gl_FragColor = tcolor * tcolor.a;
}
