#define PI 3.141592653589793
precision mediump float;

varying vec3 v_normal;

uniform samplerCube u_texture;

// layout(location = 0) out vec4 colorOut;


vec4 rotateY(in vec4 inQuat, float rad)  {
  rad *= 0.5;
  vec4 outQuat;
  

  float by = sin(rad);
  float bw = cos(rad);

  outQuat[0] = inQuat.x * bw - inQuat.z * by;
  outQuat[1] = inQuat.y * bw + inQuat.w * by;
  outQuat[2] = inQuat.z * bw + inQuat.x * by;
  outQuat[3] = inQuat.w * bw - inQuat.y * by;

  return outQuat;
}

vec4 rotateX(in vec4 inQuat, float rad) {
  rad *= 0.5;
vec4 outQuat;
  float bx = sin(rad);
  float bw = cos(rad);

  outQuat[0] = inQuat.x * bw + inQuat.w * bx;
  outQuat[1] = inQuat.y * bw + inQuat.z * bx;
  outQuat[2] = inQuat.z * bw - inQuat.y * bx;
  outQuat[3] = inQuat.w * bw - inQuat.x * bx;

   return outQuat;
}

vec3 transformQuat(vec3 a, vec4 q) {
  vec3 outVec;
  
  // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);
  float uvx = q.y * a.z - q.z * a.y;
  float uvy = q.z * a.x - q.x * a.z;
  float uvz = q.x * a.y - q.y * a.x;
  // var uuv = vec3.cross([], qvec, uv);
  float uuvx = q.y * uvz - q.z * uvy;
  float uuvy = q.z * uvx - q.x * uvz;
  float uuvz = q.x * uvy - q.y * uvx;
  // vec3.scale(uv, uv, 2 * w);
  float w2 = q.w * 2.0;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  // vec3.scale(uuv, uuv, 2);
  uuvx *= 2.0;
  uuvy *= 2.0;
  uuvz *= 2.0;
  // return vec3.add(out, a, vec3.add(out, uv, uuv));
  outVec.x = a.x + uvx + uuvx;
  outVec.y = a.y + uvy + uuvy;
  outVec.z = a.z + uvz + uuvz;
  return outVec;
}

void main(void){

  // based variables
  vec3 color = vec3(0.0);
  vec4 ident_quat = vec4(0.0,0.0,0.0,1.0);
  vec4 final_quat;
  vec3 normal;

  // nb sample for each line
  const int sampleAxeAmount = 64;
  const int sampleAxeAmountHalf = sampleAxeAmount / 2;  

  // iradiance field angle  
  const float sampleOm = PI / 4.0;
  // angle between each sample                          
  const float sampleOffset = float(sampleOm) / float(sampleAxeAmount);    

  // total sample is square of (sampleAxeAmount + original target) 
  const float totalSampleAmount = (float(sampleAxeAmount) + 1.0) * (float(sampleAxeAmount) + 1.0 );

  // iterate through samples
  for(int i=-sampleAxeAmountHalf; i <= sampleAxeAmountHalf;i++){
    for(int f=-sampleAxeAmountHalf; f <= sampleAxeAmountHalf;f++){
       // apply rotation in both axes
       final_quat = rotateX(ident_quat,float(i) * 0.03);
       final_quat = rotateY(final_quat,float(f) * 0.03);

       // transform normal
       normal = transformQuat(normalize(v_normal),final_quat);

       // get sample and add to color
       vec3 sampleColor = textureCube(u_texture,normalize(normal)).xyz ;
       color += vec3(sampleColor.x / totalSampleAmount,sampleColor.y / totalSampleAmount,sampleColor.z / totalSampleAmount);
    }
  }

  gl_FragColor = vec4(color,1.0);
}