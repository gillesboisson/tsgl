#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform mat4 mvp;
uniform sampler2D texture;

varying vec4 vcolor;
varying vec2 vuv;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main(){
    vec4 tcolor = texture2D(texture,vuv);



    float sigDist = median(tcolor.r, tcolor.g, tcolor.b);
    float w = fwidth(sigDist);
    float opacity = smoothstep(0.5 - w, 0.5 + w, sigDist);

    if(opacity < 0.005) discard;

    gl_FragColor = vec4(vcolor.rgb * opacity, opacity * vcolor.a);


}
