precision highp float;

varying vec3 v_shadowCoord;
varying vec3 v_normal;

uniform vec3 u_lightDirection;
uniform sampler2D u_shadowMap;

#ifndef SAMPLE_SIZE
#define SAMPLE_SIZE 7.0
#endif

#define SAMPLE_FRAC 49.0
#define SAMPLE_MAX (SAMPLE_SIZE - 1.0) / 2.0
#define SAMPLE_MIN -SAMPLE_MAX






float shadowInsensity (in sampler2D shadowMap,float depth,in vec2 uv,const float bias){

  vec4 shadowD = texture2D( u_shadowMap, uv  );
  if ( shadowD.x  <  depth - bias ){
   return 0.0;
  } 

  return 1.0;
}


float pcf(in sampler2D shadowMap,float depth,in vec2 uv,in vec2 pixelSize, const float bias){
  float visibility = 0.0;

  for(float i = SAMPLE_MIN; i <= SAMPLE_MAX ; i++){
    for(float f = SAMPLE_MIN; f <= SAMPLE_MAX ; f++){

     

      visibility += shadowInsensity(
        shadowMap,
        depth,
        uv + vec2(f * pixelSize.x,i * pixelSize.y),
        bias
      ) / 25.0;
    }
  }

  return visibility;
}

void main(){
    // float visibility = 1.0;
    vec3 normal = normalize(v_normal);
    float cosTheta = dot(normal, u_lightDirection);
    
    float bias = 0.005*tan(acos(cosTheta));
    if(bias > 0.01) bias = 0.01;
    if(bias < 0.0) bias = 0.0;


    // for()

    // vec4 shadowD = texture2D( u_shadowMap, v_shadowCoord.xy  );
    // if ( shadowD.x  <  v_shadowCoord.z - bias ){
    //     visibility = 0.0;
    // }

    if(v_shadowCoord.x < 0.0 || v_shadowCoord.y < 0.0 || v_shadowCoord.x > 1.0 || v_shadowCoord.y > 1.0){
      discard;
    }

    // float visibility = pcf25(u_shadowMap,v_shadowCoord.z,v_shadowCoord.xy,vec2(1.0/2048.0),bias);
    float visibility = pcf(u_shadowMap,v_shadowCoord.z,v_shadowCoord.xy,vec2(1.0/2048.0),bias);


   

    gl_FragColor = vec4(vec3(visibility) * 0.3 + 0.7,1.0);
    // gl_FragColor = vec4(u_lightDirection * 0.5 +0.5,1.0);
    // gl_FragColor = vec4(vec3(cos(acos(cosTheta))),1.0);
    // gl_FragColor = vec4(normal * 0.5 + 0.5,1.0);
}
