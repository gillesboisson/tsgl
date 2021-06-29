#version 300 es
precision mediump float;

#define SSR_STEP_AMOUNT 4.0
#define SSR_MAX_STEPS 32

uniform mat4 u_pMat;

uniform sampler2D u_normalMap;
uniform sampler2D u_positionMap;
uniform sampler2D u_depthMap;
uniform sampler2D u_texture;

in vec2 v_uv;



out vec4 FragColor;



const float near = 0.001;
const float far = 100.0;

float LinearizeDepth(float depth) 
{
    float z = depth * 2.0 - 1.0; // back to NDC 
    return (2.0 * near * far) / (far + near - z * (far - near));	
}


float linearize_Z(float depth , float zNear , float zFar){

return (2.0*zNear ) / (zFar + zNear - depth*(zFar -zNear)) ;
}

float getDepth(sampler2D depthMap, vec2 uv){
  return linearize_Z(texture(depthMap, uv).r, 0.001, 100.0);
}


void main(){

  vec3 rayO   = texture(u_positionMap, v_uv).xyz;
  vec3 V = normalize(-rayO);
  vec3 rayViewNormal = texture(u_normalMap, v_uv).rgb;
  vec3 rayD = normalize(reflect(V, rayViewNormal));

  // float depth    = texture(u_depthMap, v_uv).r;



  // prepare ray stepping
  vec3 viewFirstStep = rayO + rayD;
  vec3 rayOScreen = vec3(v_uv, getDepth(u_depthMap,v_uv));
  vec3 screenFirstStep = (u_pMat * vec4(viewFirstStep, 1.0)).xyz;
  vec3 stepDist = screenFirstStep - rayOScreen;

  vec3 rayDScreen = normalize(stepDist) * SSR_STEP_AMOUNT;
  
  vec3 rayPrevPos = rayOScreen;
  vec3 rayCurPos = rayPrevPos + rayDScreen;



  vec4 outCol = vec4(0.0);

  int steps = 0;
  while(steps < SSR_MAX_STEPS){

    // TODO: offscreen detection

    float diff = rayCurPos.z - getDepth(u_depthMap,rayCurPos.xy);


    if(diff >= 0.0 && diff < length(rayDScreen)){
      outCol = texture(u_texture, rayCurPos.xy);
      // outCol = vec4(1.0);
      break;
    }
    
    rayPrevPos = rayCurPos;
    rayCurPos = rayCurPos + rayDScreen;
    steps++;

  }

  FragColor = outCol;
  // FragColor = vec4(linearize_Z(texture(u_texture, v_uv).r, 0.001, 100.0));
  // FragColor = vec4(screenFirstStep, 1.0);


}

