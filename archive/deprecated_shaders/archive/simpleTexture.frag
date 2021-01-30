precision mediump float;

//precision mediump float;
//uniform mat4 mvp;
uniform sampler2D texture;
uniform vec4 color;

// varying vec4 vcolor;
varying vec2 v_uv;

void main(){
    vec4 tcolor = texture2D(texture,v_uv);    
    gl_FragColor = vec4(tcolor.rgb,1) * color;
}
