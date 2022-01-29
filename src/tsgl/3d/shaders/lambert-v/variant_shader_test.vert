precision mediump float;


float lambert(mat4 mvMat, vec3 position, vec3 normal, vec3 lightPos){
  vec3 modelViewVertex = vec3(mvMat * vec4(position,1.0));

  // Transform the normal's orientation into eye space.
  vec3 modelViewNormal = vec3(mvMat * vec4(normal, 0.0));

  // Will be used for attenuation.
  float distance = length(lightPos - modelViewVertex);

  // Get a lighting direction vector from the light to the vertex.
  vec3 lightVector = normalize(lightPos - modelViewVertex);

  // Calculate the dot product of the light vector and vertex normal. If the normal and light vector are
  // pointing in the same direction then it will get max illumination.
  float diffuse = max(dot(modelViewNormal, lightVector), 0.1);

  // Attenuate the light based on distance.
  return diffuse * (1.0 / (1.0 + (0.25 * distance * distance)));
}


uniform mat4 u_mvpMat;

#ifdef VERTEX_SHADE
uniform vec3 u_lightPos;
uniform vec4 u_color;
uniform mat4 u_mvMat; 

#endif


attribute vec3 a_position;
attribute vec2 a_uv;
attribute vec3 a_normal;

varying vec2 v_uv;
varying vec3 v_position;

#ifdef VERTEX_SHADE
varying vec4 v_vertexColor;
#endif

#ifdef FRAGMENT_SHADE
varying vec3 v_normal;
#endif


void main(void){
  v_uv = a_uv;
  v_position = a_position;

  #ifdef FRAGMENT_SHADE
    v_normal = a_normal;
  #endif

  #ifdef VERTEX_SHADE
    v_vertexColor = vec4((u_color * lambert(u_mvMat,a_position,a_normal,u_lightPos)).rgb,1.0);
  #endif

  
  gl_Position = u_mvpMat * vec4(a_position,1.0);
  
}