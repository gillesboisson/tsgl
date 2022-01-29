
precision mediump float;
varying vec2 v_uv;
varying vec3 v_normal;
varying vec2 v_position;

uniform sampler2D u_texture;

// layout(location = 0) out vec4 colorOut;

void main(void){

  gl_FragColor = texture2D(u_texture,v_uv);

  // gl_FragColor = vec4(v_uv,0.0,1.0);
}