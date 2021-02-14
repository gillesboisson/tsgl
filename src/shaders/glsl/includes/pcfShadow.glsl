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

#pragma glslify: export(pcfShadow)
