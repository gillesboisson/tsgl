precision highp float;

varying vec3 v_shadowCoord;
varying vec3 v_normal;

uniform vec3 u_lightDirection;
uniform sampler2D u_shadowMap;

uniform vec2 u_pixelSize;

#ifndef SAMPLE_SIZE
#define SAMPLE_SIZE 5.0
#endif

#ifndef SAMPLE_FRAC
#define SAMPLE_FRAC 25.0
#endif

#ifndef BASE_BIAS
#define BASE_BIAS 0.005
#endif


#define SAMPLE_MAX (SAMPLE_SIZE - 1.0) / 2.0
#define SAMPLE_MIN -SAMPLE_MAX


float pcfShadow(in sampler2D shadowMap,float depth,in vec2 uv,in vec2 pixelSize,in vec3 normal,in vec3 lightDirection ){
  
  if(uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0){
    return 1.0;
  }
  
  float visibility = 0.0;


  float cosTheta = dot(normal, lightDirection);
  
  float bias = BASE_BIAS*tan(acos(cosTheta));
  if(bias > 0.01) bias = 0.01;
  if(bias < 0.0) bias = 0.0;

  for(float i = SAMPLE_MIN; i <= SAMPLE_MAX ; i++){
    for(float f = SAMPLE_MIN; f <= SAMPLE_MAX ; f++){

      vec4 shadowD = texture2D( shadowMap, uv + vec2(f * pixelSize.x / 2.0,i * pixelSize.y / 2.0)  );
      if ( shadowD.x  >=  depth - bias ){
       visibility += 1.0 / SAMPLE_FRAC;
      } 

     
    }
  }

  return visibility;
}


void main(){
    
    vec3 normal = normalize(v_normal);
    // if(v_shadowCoord.x < 0.0 || v_shadowCoord.y < 0.0 || v_shadowCoord.x > 1.0 || v_shadowCoord.y > 1.0){
    //   discard;
    // }

    float visibility = pcfShadow(u_shadowMap,v_shadowCoord.z,v_shadowCoord.xy,u_pixelSize,normal, u_lightDirection);

    gl_FragColor = vec4(vec3(visibility),1.0);
}
