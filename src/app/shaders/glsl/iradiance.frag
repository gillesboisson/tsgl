
precision mediump float;
#define SAMPLE_X 6
#define SAMPLE_Y 6
#define SAMPLE_STRENGH 1/36
#define SAMPLE_OFFSET 0.01227184630308513

varying vec3 v_normal;
varying vec2 v_position;

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
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  // let qx = q[0],
  //   qy = q[1],
  //   qz = q[2],
  //   qw = q[3];
  // let x = a[0],
  //   y = a[1],
  //   z = a[2];
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


  vec3 color = vec3(0.0);
  vec4 ident_quat = vec4(0.0,0.0,0.0,1.0);
  vec4 final_quat;
  vec3 normal;

  const int sampleLim = 32;
  const float colorRat = (float(sampleLim) * 2.0 + 1.0) * (float(sampleLim) * 2.0 + 1.0);

  for(int i=-sampleLim; i <= sampleLim;i++){
    for(int f=-sampleLim; f <= sampleLim;f++){
       final_quat = rotateX(ident_quat,float(i) * 0.03);
       final_quat = rotateY(final_quat,float(f) * 0.03);
       normal = transformQuat(normalize(v_normal),final_quat);
       vec3 sampleColor = textureCube(u_texture,normalize(normal)).xyz ;
       color += vec3(sampleColor.x / colorRat,sampleColor.y / colorRat,sampleColor.z / colorRat);
    }
  }

  gl_FragColor = vec4(color,1.0);

  // final_quat = rotateX(ident_quat,0.03);
  // normal = transformQuat(normalize(v_normal),final_quat);
  // gl_FragColor = vec4(normalize(normal) / vec3(2.0) + vec3(0.5),1.0);

  // gl_FragColor = textureCube(u_texture,normalize(v_normal));
  // gl_FragColor = vec4(normalize(v_normal) / vec3(2.0) + vec3(0.5),1.0);

  // gl_FragColor = vec4(v_uv,0.0,1.0);
}