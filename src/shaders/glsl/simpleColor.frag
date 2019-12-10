precision mediump float;

//precision mediump float;
//uniform mat4 mvp;
uniform sampler2D texture;
uniform vec4 color;

// varying vec4 vcolor;
varying vec2 vuv;

void main(){
    vec4 tcolor = texture2D(texture,vuv);    
    gl_FragColor = vec4(tcolor.rgb,1) * color;
}
