precision mediump float;

varying vec3 v_position;

uniform samplerCube u_skyboxMap;

void main(void){
  
  // position becomes normal
  vec3 normal = normalize(v_position);

  gl_FragColor = textureCube(u_skyboxMap,normal);
  // gl_FragColor = vec4(normal * vec3(0.5) + vec3(0.5),1.0);

}