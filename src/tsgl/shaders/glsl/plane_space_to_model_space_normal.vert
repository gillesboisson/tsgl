
precision mediump float;


attribute vec2 a_uv;
attribute vec3 a_normal;
attribute vec4 a_tangent;

varying vec2 v_uv;
varying mat3 v_TBN;

invariant gl_Position;

void main(void){

  v_uv = a_uv;

  vec3 normal       = normalize(a_normal);
  vec3 tangent      = normalize(a_tangent).xyz;
  vec3 bitangentW   = cross(a_normal, tangent) * a_tangent.w;
  
  v_TBN = mat3(tangent, bitangentW, normal);



  gl_Position = vec4(a_uv * vec2(2.0,2.0) + vec2(-1.0,-1.0),0.0,1.0);
  
}