#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform sampler2D u_normalMap;
uniform sampler2D u_lightDiffuseMap;
uniform sampler2D u_lightSpecMap;
uniform sampler2D u_depthMap;

uniform vec2 u_pixelSize;

in vec2 v_uv;

out vec4 Frag_color;


float modI(float a,float b) {
    float m=a-floor((a+0.5)/b)*b;
    return floor(m+0.5);
}

vec4 getOffsetTexture(sampler2D tex, vec2 uv, float x, float y){
  return texture(tex, uv + vec2(x * u_pixelSize.x, y * u_pixelSize.y));
}




float outline(vec2 uv, sampler2D tex){
  float a0 = getOffsetTexture(tex,uv,-1.0,1.0).x;
  float a1 = getOffsetTexture(tex,uv,-0.0,1.0).x;
  float a2 = getOffsetTexture(tex,uv,0.0,1.0).x;
  float a3 = getOffsetTexture(tex,uv,-1.0,0.0).x;
  float a4 = getOffsetTexture(tex,uv,-0.0,0.0).x;
  float a5 = getOffsetTexture(tex,uv,0.0,0.0).x;
  float a6 = getOffsetTexture(tex,uv,-1.0,-1.0).x;
  float a7 = getOffsetTexture(tex,uv,-0.0,-1.0).x;
  float a8 = getOffsetTexture(tex,uv,0.0,-1.0).x;
  
  float gx = -a0 + a2 - 2.0 * a3 + 2.0 * a5 - a6 + a8;
  float gy = -a0 - 2.0 * a1 - a2 + a6 + 2.0 * a7 + a8;

  return sqrt(gx * gx + gy * gy) > 0.05 ? 0.3 : 1.0;
}



void main(){
  vec4 color = texture(u_texture, v_uv);
  vec3 normal = texture(u_normalMap, v_uv).xyz * 2.0 - 1.0;
  vec3 diffuse = texture(u_lightDiffuseMap, v_uv).rgb;
  vec3 spec = texture(u_lightSpecMap, v_uv).rgb;
  vec4 depth = texture(u_depthMap, v_uv);

  float lightInt = diffuse.r;
  float lit;
  if(lightInt > 0.4){
    lit = 1.0;
  }else if(lightInt > 0.1){
    lit =  modI(gl_FragCoord.x,2.0) == 0.0 || modI(gl_FragCoord.y,2.0) == 0.0 ? 1.0 : 0.3;
  }else{
    lit =  modI(gl_FragCoord.x + gl_FragCoord.y,2.0) == 0.0 ? 1.0 : 0.1;
  }

  float specF = spec.r > 0.7 ? 1.0 : 0.0;


  // Frag_color = color * vec4(diffuse+spec,1.0) * (1.0 - outline(v_uv,u_depthMap));
  Frag_color = color * (lit + specF) * color.a * outline(v_uv,u_depthMap);
  // Frag_color = color;
  // Frag_color = vec4(outline(v_uv,u_depthMap));
}

