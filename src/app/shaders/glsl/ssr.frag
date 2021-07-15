#version 300 es
precision highp float;


uniform mat4 u_pMat;
uniform vec2 u_texSize;

uniform sampler2D u_normalMap;
uniform sampler2D u_positionMap;
uniform sampler2D u_depthMap;
uniform sampler2D u_texture;

in vec2 v_uv;

out vec4 FragColor;


void main(){

  
  float maxDistance = 9.0;
  // float resolution  = 0.2;
  int   steps       = 16;
  float thickness   = 2.0;
  int firstPassSteps  = 16;


  vec4 uv = vec4(0.0);

  vec4 positionFrom     = texture(u_positionMap, v_uv);
  vec3 unitPositionFrom = normalize(positionFrom.xyz);
  vec3 normal           = normalize(texture(u_normalMap, v_uv).xyz);
  vec3 pivot            = normalize(reflect(unitPositionFrom, normal));

  vec4 positionTo = positionFrom;

  
  vec4 startView = vec4(positionFrom.xyz, 1.0);
  vec4 endView   = vec4(positionFrom.xyz + (pivot * maxDistance), 1.0);

  vec4 startFrag      = startView;
  // Project to screen space.
  startFrag      = u_pMat * startFrag;
  // Perform the perspective divide.
  startFrag.xyz /= startFrag.w;
  // Convert the screen-space XY coordinates to UV coordinates.
  startFrag.xy   = startFrag.xy * 0.5 + 0.5;
  // Convert the UV coordinates to fragment/pixel coordnates.
  startFrag.xy  *= u_texSize;

  vec4 endFrag      = endView;
  endFrag      = u_pMat * endFrag;
  endFrag.xyz /= endFrag.w;
  endFrag.xy   = endFrag.xy * 0.5 + 0.5;
  endFrag.xy  *= u_texSize;

  vec2 frag  = startFrag.xy;
  uv.xy = frag / u_texSize;


  float deltaX = endFrag.x - startFrag.x;
  float deltaY = endFrag.y - startFrag.y;


  
  float useX = abs(deltaX) >= abs(deltaY) ? 1.0 : 0.0;
  float delta = mix(abs(deltaY), abs(deltaX), useX);
  

  vec2  increment = vec2(deltaX, deltaY) / float(firstPassSteps);

  float search0 = 0.0;
  float search1 = 0.0;

  int hit0 = 0;
  int hit1 = 0;

  float viewDistance = startView.z;
  float depth = thickness;

  // int firstPassSteps = min(int(delta),16);

  for (int i = 0; i < firstPassSteps; ++i) {
    frag      += increment;
    uv.xy      = frag / u_texSize;
    positionTo = texture(u_positionMap, uv.xy);

    search1 =
      mix
        ( (frag.y - startFrag.y) / deltaY
        , (frag.x - startFrag.x) / deltaX
        , useX
        );

    viewDistance = (startView.z * endView.z) / mix(endView.z, startView.z, search1);
    depth = positionTo.z - viewDistance;

    if (depth > 0.0 && depth < thickness) {
      hit0 = 1;
     
      break;
    } else {
      search0 = search1;
    }


  }

  steps *= hit0;
  search1 = search0 + ((search1 - search0) / 2.0);

  for (int i = 0; i < steps; ++i) {
    frag       = mix(startFrag.xy, endFrag.xy, search1);
    uv.xy      = frag / u_texSize;
    positionTo = texture(u_positionMap, uv.xy);

     viewDistance = (startView.z * endView.z) / mix(endView.z, startView.z, search1);
     depth = positionTo.z - viewDistance;

    if (depth > 0.0 && depth < thickness) {
      hit1 = 1;
      search1 = search0 + ((search1 - search0) / 2.0);
    } else {
      float temp = search1;
      search1 = search1 + ((search1 - search0) / 2.0);
      search0 = temp;
    }
  }

  float visibility = hit1 > 0 ? (
    positionTo.w   // If the reflected scene position's alpha or w component is zero, the visibility is zero
    * dot(unitPositionFrom, pivot)
    * (1.0 - length(positionTo - positionFrom) / maxDistance)
    * (1.0 - depth / thickness)
      
    // * ( 1.0            
    //   - clamp // fade based on depth precision
    //       ( depth / thickness
    //       , 0.0
    //       , 1.0
    //       )
    //   ) 
    // * ( 1.0 // fade based on ray length (far point are less precise)
    //   - clamp
    //       (   length(positionTo - positionFrom)
    //         / maxDistance
    //       , 0.0
    //       , 1.0
    //       )
    //   ) 
    // handle out of camera frustrum hitpoint
    * (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0 ? 0.0 : 1.0)
  

    ) : 0.0
    ;
    

  visibility = clamp(visibility, 0.0, 0.3);

  uv.ba = vec2(visibility);

  FragColor = vec4(pivot, 1.0);
  FragColor = texture(u_texture, v_uv);
  FragColor = vec4(positionTo.xyz / 10.0, 1.0) * visibility;
  FragColor = vec4(positionTo.xyz / 15.0, 1.0) ;
  FragColor = vec4(increment,0.0,1.0) ;

  // FragColor = u_pMat * vec4(positionFrom.xyz, 1.0);
  // FragColor = vec4(positionFrom.xyz, 1.0);
  // FragColor = vec4(positionTo.xyz / 20.0, 1.0);
  // FragColor = vec4(texture(u_texture, v_uv).xyz,1.0);
  FragColor = texture(u_texture, v_uv) + vec4(texture(u_texture, uv.xy).xyz,visibility) * visibility ;
  

  // FragColor = vec4(visibility);
} 

