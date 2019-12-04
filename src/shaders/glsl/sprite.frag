uniform mat4 mvp;
uniform sampler2D texture;

varying vec4 vcolor;
varying vec2 vuv;

void main(){
    vec4 tcolor = texture2D(texture,vuv);

    gl_FragColor = tcolor * vcolor * vcolor.a;

}
