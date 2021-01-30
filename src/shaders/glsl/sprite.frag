precision mediump float;

uniform mat4 u_mvp;
uniform sampler2D u_texture;

varying vec4 v_color;
varying vec2 v_uv;

void main(){
    vec4 color = texture2D(u_texture,v_uv);
    gl_FragColor = color * v_color * v_color.a * color.a;

}
