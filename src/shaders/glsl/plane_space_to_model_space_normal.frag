
precision mediump float;

varying vec2 v_uv;
varying mat3 v_TBN;

uniform sampler2D u_normalMap;

void main(void){
  
  vec3 normal, t, b, ng;

  
  // TBN split
  t = normalize(v_TBN[0]);
  b = normalize(v_TBN[1]);
  ng = normalize(v_TBN[2]);

  normal = texture2D(u_normalMap,v_uv).rgb * 2.0 - vec3(1.0);
  normal = mat3(t, b, ng) * normalize(normal);
  
  gl_FragColor = vec4(normal.x / 2.0 + .5,normal.y / 2.0 + .5,normal.z / 2.0 + .5,1.0);
  
}