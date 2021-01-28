#version 300 es
precision mediump float;
in vec2 vUv;
in vec3 vNormal;
in vec3 vPosition;
in vec4 vTangent;
in mat3 vTBN;



uniform sampler2D tex;


uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform vec3 ambiantLightColor;
uniform vec3 cameraPos;

layout(location = 0) out vec4 colorOut;

void main(void){
  
  vec3 normal, t, b, ng;

  // eye direction
  vec3 eyeDirection = normalize(cameraPos - vPosition);

  // TBN split
  t = normalize(vTBN[0]);
  b = normalize(vTBN[1]);
  ng = normalize(vTBN[2]);

  // check for back cam facing element based on normal and mirror vectors if required
  // float facing = step(0.0, dot(eyeDirection, ng)) * 2.0 - 1.0;
  // t *= facing;
  // b *= facing;
  // ng *= facing;


  // get normal from texture
  normal = texture(tex,vUv).rgb * 2.0 - vec3(1.0);
  //n *= vec3(u_NormalScale, u_NormalScale, 1.0);
  // apply TBN transformat to normal
  normal = mat3(t, b, ng) * normalize(normal);
  
  // vec3 nColor = texture(tex,vUv).xyz;
  // vec3 normal =  (vTBN * vec4(nColor.r * 2.0 - 1.0,nColor.g * 2.0 - 1.0,nColor.b * 2.0 - 1.0,1.0)).xyz;

  // colorOut = texture(tex,vUv);
  // colorOut = vTangent;
  

  colorOut = vec4(normal.x / 2.0 + .5,normal.y / 2.0 + .5,normal.z / 2.0 + .5,1.0);
  // colorOut = vec4(eyeDirection,1.0);
}