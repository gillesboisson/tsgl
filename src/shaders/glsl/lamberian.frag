#version 300 es
precision mediump float;
in vec2 v_uv;
in vec3 v_normal;
in vec3 v_position;
in vec4 v_tangent;
in mat3 v_TBN;



uniform sampler2D u_tex;
uniform samplerCube u_cmap;


uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;
uniform vec3 u_ambiantLightColor;
uniform vec3 u_cameraPos;

layout(location = 0) out vec4 colorOut;

void main(void){
  
  vec3 normal, t, b, ng;

  // eye direction
  vec3 eyeDirection = normalize(u_cameraPos - v_position);

  // TBN split
  t = normalize(v_TBN[0]);
  b = normalize(v_TBN[1]);
  ng = normalize(v_TBN[2]);

  normal = texture(u_tex,v_uv).rgb * 2.0 - vec3(1.0);
  normal = mat3(t, b, ng) * normalize(normal);
  

  // colorOut = texture(tex,v_uv);
  // colorOut = v_tangent;
  // colorOut = vec4(normal.x / 2.0 + .5,normal.y / 2.0 + .5,normal.z / 2.0 + .5,1.0);
  colorOut = texture(u_cmap,normal);
}