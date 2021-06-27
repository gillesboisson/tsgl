#version 300 es
precision mediump float;


uniform sampler2D u_texture;

uniform vec2 u_texSize;

in vec2 v_uv;

out vec4 FragColor;

void main() {
  float result = 0.0;
  for (int x = -2; x < 2; ++x) 
  {
    for (int y = -2; y < 2; ++y) 
    {
      vec2 offset = vec2(float(x), float(y)) * u_texSize;
      result += texture(u_texture, v_uv + offset).r;
    }
  }
  FragColor = vec4(result / (4.0 * 4.0));
  // FragColor = texture(u_texture,v_uv);
  // FragColor = vec4(1.0,0.0,1.0,1.0);

}  

