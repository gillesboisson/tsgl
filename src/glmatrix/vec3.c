#include "./glmatrix.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>
#include <stdio.h>

Vec3 Vec3_create()
{
  Vec3 out = malloc(sizeof(VecP) * 3);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}

Vec3 Vec3_clone(Vec3 v)
{
  Vec3 out = malloc(3 * sizeof(VecP));
  out[0] = v[0];
  out[1] = v[1];
  out[2] = v[2];
  return out;
}

VecP Vec3_length(Vec3 a)
{
  return sqrt((a[0] * a[0] + a[1] * a[1] + a[2] * a[2]));
}

Vec3 Vec3_fromValues(VecP x, VecP y, VecP z)
{
  Vec3 out = malloc(3 * sizeof(VecP));
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

Vec3 Vec3_copy(Vec3 out, Vec3 input)
{
  out[0] = input[0];
  out[1] = input[1];
  out[2] = input[2];
  return out;
}

Vec3 Vec3_set(Vec3 out, VecP x, VecP y, VecP z)
{
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

Vec3 Vec3_add(Vec3 out, Vec3 a, Vec3 b)
{
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}

Vec3 Vec3_subtract(Vec3 out, Vec3 a, Vec3 b)
{
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}

Vec3 Vec3_multiply(Vec3 out, Vec3 a, Vec3 b)
{
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}

Vec3 Vec3_divide(Vec3 out, Vec3 a, Vec3 b)
{
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}

Vec3 Vec3_ceil(Vec3 out, Vec3 a)
{
  out[0] = ceil(a[0]);
  out[1] = ceil(a[1]);
  out[2] = ceil(a[2]);
  return out;
}

Vec3 Vec3_floor(Vec3 out, Vec3 a)
{
  out[0] = floor(a[0]);
  out[1] = floor(a[1]);
  out[2] = floor(a[2]);
  return out;
}

Vec3 Vec3_min(Vec3 out, Vec3 a, Vec3 b)
{
  out[0] = min(a[0], b[0]);
  out[1] = min(a[1], b[1]);
  out[2] = min(a[2], b[2]);

  return out;
}
Vec3 Vec3_max(Vec3 out, Vec3 a, Vec3 b)
{
  out[0] = max(a[0], b[0]);
  out[1] = max(a[1], b[1]);
  out[2] = max(a[2], b[2]);

  return out;
}

Vec3 Vec3_round(Vec3 out, Vec3 a)
{
  out[0] = round(a[0]);
  out[1] = round(a[1]);
  out[2] = round(a[2]);
  return out;
}

Vec3 Vec3_scale(Vec3 out, Vec3 a, VecP scale)
{
  out[0] = a[0] * scale;
  out[1] = a[1] * scale;
  out[2] = a[2] * scale;
  return out;
}

Vec3 Vec3_scaleAndAdd(Vec3 out, Vec3 a, Vec3 b, VecP scale)
{
  out[0] = a[0] * scale + b[0];
  out[1] = a[1] * scale + b[1];
  out[2] = a[2] * scale + b[2];
  return out;
}

VecP Vec3_distance(Vec3 out, Vec3 a, Vec3 b)
{
  VecP x = b[0] - a[0];
  VecP y = b[1] - a[1];
  VecP z = b[2] - a[2];
  return sqrt((x * x + y * y + z * z));
}

VecP Vec3_squareDistance(Vec3 out, Vec3 a, Vec3 b)
{
  VecP x = b[0] - a[0];
  VecP y = b[1] - a[1];
  VecP z = b[2] - a[2];
  return x * x + y * y + z * z;
}

Vec3 Vec3_negate(Vec3 out, Vec3 a)
{
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}

Vec3 Vec3_inverse(Vec3 out, Vec3 a)
{
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  return out;
}

Vec3 Vec3_normalize(Vec3 out, Vec3 a)
{
  VecP len = a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
  if (len > 0)
  {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / sqrt(len);
  }
  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}

VecP Vec3_dot(Vec3 a, Vec3 b)
{
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

Vec3 Vec3_cross(Vec3 out, Vec3 a, Vec3 b)
{
  VecP ax = a[0], ay = a[1], az = a[2];
  VecP bx = b[0], by = b[1], bz = b[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}

Vec3 Vec3_lerp(Vec3 out, Vec3 a, Vec3 b, VecP t)
{
  VecP ax = a[0];
  VecP ay = a[1];
  VecP az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}

Vec3 Vec3_hermite(Vec3 out, Vec3 a, Vec3 b, Vec3 c, Vec3 d, VecP t)
{
  VecP factorTimes2 = t * t;
  VecP factor1 = factorTimes2 * (2 * t - 3) + 1;
  VecP factor2 = factorTimes2 * (t - 2) + t;
  VecP factor3 = factorTimes2 * (t - 1);
  VecP factor4 = factorTimes2 * (3 - 2 * t);

  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

  return out;
}

Vec3 Vec3_bezier(Vec3 out, Vec3 a, Vec3 b, Vec3 c, Vec3 d, VecP t)
{
  VecP inverseFactor = 1 - t;
  VecP inverseFactorTimesTwo = inverseFactor * inverseFactor;
  VecP factorTimes2 = t * t;
  VecP factor1 = inverseFactorTimesTwo * inverseFactor;
  VecP factor2 = 3 * t * inverseFactorTimesTwo;
  VecP factor3 = 3 * factorTimes2 * inverseFactor;
  VecP factor4 = factorTimes2 * t;

  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

  return out;
}

Vec3 Vec3_random(Vec3 out, VecP scale)
{

  VecP r = random() * 2.0 * M_PI;
  VecP z = (random() * 2.0) - 1.0;
  VecP zScale = sqrt(1.0 - z * z) * scale;

  out[0] = cos(r) * zScale;
  out[1] = sin(r) * zScale;
  out[2] = z * scale;
  return out;
}

Vec3 Vec3_transformMat4(Vec3 out, Vec3 a, Mat4 m)
{
  VecP x = a[0], y = a[1], z = a[2];
  VecP w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}

/*
Vec3 Vec3_transformMat2d(Vec3 out, Vec3 a, Mat2d m) {
  VecP x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}
*/

Vec3 Vec3_transformMat3(Vec3 out, Vec3 a, Mat3 m)
{
  VecP x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}

Vec3 transformQuat(Vec3 out, Vec3 a, Quat q)
{
  VecP qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  VecP x = a[0], y = a[1], z = a[2];
  // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);
  VecP uvx = qy * z - qz * y,
       uvy = qz * x - qx * z,
       uvz = qx * y - qy * x;
  // var uuv = vec3.cross([], qvec, uv);
  VecP uuvx = qy * uvz - qz * uvy,
       uuvy = qz * uvx - qx * uvz,
       uuvz = qx * uvy - qy * uvx;
  // vec3.scale(uv, uv, 2 * w);
  VecP w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  // vec3.scale(uuv, uuv, 2);
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  // return vec3.add(out, a, vec3.add(out, uv, uuv));
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}

Vec3 Vec3_rotateX(Vec3 out, Vec3 a, Vec3 b, VecP rad)
{

  //Translate point to the origin
  VecP pX = a[0] - b[0];
  VecP pY = a[1] - b[1];
  VecP pZ = a[2] - b[2];

  //perform rotation
  VecP rX = pX;
  VecP rY = pY * cos(rad) - pZ * sin(rad);
  VecP rZ = pY * sin(rad) + pZ * cos(rad);

  //translate to correct position
  out[0] = rX + b[0];
  out[1] = rY + b[1];
  out[2] = rZ + b[2];

  return out;
}

Vec3 Vec3_rotateY(Vec3 out, Vec3 a, Vec3 b, VecP rad)
{

  //Translate point to the origin
  VecP pX = a[0] - b[0];
  VecP pY = a[1] - b[1];
  VecP pZ = a[2] - b[2];

  //perform rotation
  VecP rX = pZ * sin(rad) + pX * cos(rad);
  VecP rY = pY;
  VecP rZ = pZ * cos(rad) - pX * sin(rad);

  //translate to correct position
  out[0] = rX + b[0];
  out[1] = rY + b[1];
  out[2] = rZ + b[2];

  return out;
}

Vec3 Vec3_rotateZ(Vec3 out, Vec3 a, Vec3 b, VecP rad)
{

  //Translate point to the origin
  VecP pX = a[0] - b[0];
  VecP pY = a[1] - b[1];
  VecP pZ = a[2] - b[2];

  //perform rotation
  VecP rX = pX * cos(rad) - pY * sin(rad);
  VecP rY = pX * sin(rad) + pY * cos(rad);
  VecP rZ = pZ;

  //translate to correct position
  out[0] = rX + b[0];
  out[1] = rY + b[1];
  out[2] = rZ + b[2];

  return out;
}

VecP __vec3T1[3];
VecP __vec3T2[3];

VecP Vec3_angle(Vec3 a, Vec3 b)
{
  //Vec3 __vec3T1 = Vec3_fromValues(a[0],a[1],a[2]);
  //Vec3 __vec3T2 = Vec3_fromValues(a[0],a[1],a[2]);;

  Vec3_copy(__vec3T1, a);
  Vec3_copy(__vec3T2, b);

  Vec3_normalize(__vec3T1, __vec3T1);
  Vec3_normalize(__vec3T2, __vec3T2);

  VecP cosine = Vec3_dot(__vec3T1, __vec3T2);

  if (cosine > 1.0)
  {
    return 0;
  }

  else if (cosine < -1.0)
  {
    return M_PI;
  }
  else
  {
    return acos(cosine);
  }
}

Vec3 Vec3_zero(Vec3 out)
{
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}

bool Vec3_equals(Vec3 a, Vec3 b)
{
  return a[0] == b[0] && a[1] == b[1] && a[2] == b[2];
}

void Vec3_print(Vec3 a){
  printf("[Vec3]: %f,%f,%f\n", a[0], a[1], a[2]);
}