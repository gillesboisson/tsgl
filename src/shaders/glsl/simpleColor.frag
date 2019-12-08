precision mediump float;

#ifndef SHADER_MODE
#define SHADER_MODE 0
#endif
//precision mediump float;
//uniform mat4 mvp;
uniform sampler2D texture;

// varying vec4 vcolor;
varying vec2 vuv;

void main(){
    vec4 tcolor = texture2D(texture,vuv);
    #if SHADER_MODE == 1
    gl_FragColor = vec4(tcolor.r,0,0,1);
    #elif SHADER_MODE == 2
    gl_FragColor = vec4(0,tcolor.g,0,1);
    #elif SHADER_MODE == 3
    gl_FragColor = vec4(0,0, tcolor.b,1);
    #else
    gl_FragColor = vec4(tcolor.rgb,1);
    #endif

}
