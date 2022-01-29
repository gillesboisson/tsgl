#version 300 es
precision mediump float;



#ifndef KERNEL_LENGTH
#define KERNEL_LENGTH 9
#define KERNEL_WIDTH 3
#define KERNEL_MIN -1
#define KERNEL_MAX 1
#endif

uniform sampler2D u_texture;

uniform float u_kernel[KERNEL_LENGTH];
uniform float u_radius;
uniform float u_textureWidth;
uniform float u_textureHeight;
uniform float u_textureLod;


in vec2 v_uv;

out vec4 color;


void main(){

  
  float stepX = u_radius / u_textureWidth;
  float stepY = u_radius / u_textureHeight;

  // color = texture(u_texture, v_uv);
  color = vec4(0);

  int vX;
  int vY;


  for(vX = KERNEL_MIN; vX <= KERNEL_MAX ; vX++ ){
    for(vY = KERNEL_MIN; vY <= KERNEL_MAX ; vY++ ){
      int ind = KERNEL_WIDTH * (vY + KERNEL_MAX) + (vX + KERNEL_MAX);
      if(ind < 0 || ind > KERNEL_LENGTH) continue;
      if(u_kernel[ind] != 0.0){
        color += textureLod(u_texture, v_uv + vec2(float (vX) * stepX, float(vY) * stepY), u_textureLod) * u_kernel[ind];
      }
    }
  }


  // float ind = float(uint(v_uv.x * 2.0) + uint(v_uv.y * 2.0 ) * uint(2)) + 1.0;


  // color = vec4(textureLod(u_texture,v_uv * 2.0,ind).xyz, 1.0);
}



