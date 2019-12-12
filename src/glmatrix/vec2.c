#include "./glmatrix.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>


Vec2 Vec2_create(){
    Vec2 out = malloc(sizeof(VecP) * 3);
    out[0] = 0;
    out[1] = 0;
    return out;
}

Vec2 Vec2_clone(Vec2 v){
    Vec2 out = malloc(2 * sizeof(VecP));
    out[0] = v[0];
    out[1] = v[1];
    return out;
}

Vec2 Vec2_fromValues(VecP x, VecP y){
    Vec2 out = malloc(2 * sizeof(VecP));
    out[0] = x;
    out[1] = y;
    return out;
}

Vec2 Vec2_copy(Vec2 out, Vec2 input){
    out[0] = input[0];
    out[1] = input[1];
    return out;
}

Vec2 Vec2_set(Vec2 out, VecP x, VecP y){
    out[0] = x;
    out[1] = y;
    return out;
}

Vec2 Vec2_add(Vec2 out, Vec2 a, Vec2 b){
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
}

Vec2 Vec2_subtract(Vec2 out, Vec2 a, Vec2 b){
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
}

Vec2 Vec2_multiply(Vec2 out, Vec2 a, Vec2 b){
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
}

Vec2 Vec2_divide(Vec2 out, Vec2 a, Vec2 b){
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
}


Vec2 Vec2_ceil(Vec2 out, Vec2 a){
    out[0] = ceil(a[0]);
    out[1] = ceil(a[1]);
    return out;
}

Vec2 Vec2_floor(Vec2 out, Vec2 a){
    out[0] = floor(a[0]);
    out[1] = floor(a[1]);
    return out;
}


Vec2 Vec2_min(Vec2 out, Vec2 a, Vec2 b){
    out[0] = min(a[0], b[0]);
    out[1] = min(a[1], b[1]);
    out[2] = min(a[2], b[2]);

    return out;
}

Vec2 Vec2_max(Vec2 out, Vec2 a, Vec2 b){
    out[0] = max(a[0], b[0]);
    out[1] = max(a[1], b[1]);
    out[2] = max(a[2], b[2]);

    return out;
}

Vec2 Vec2_round(Vec2 out, Vec2 a){
    out[0] = round(a[0]);
    out[1] = round(a[1]);
    return out;
}

Vec2 Vec2_scale(Vec2 out, Vec2 a, VecP scale){
    out[0] = a[0] * scale;
    out[1] = a[1] * scale;
    return out;
}


Vec2 Vec2_scaleAndAdd(Vec2 out, Vec2 a, Vec2 b, VecP scale){
    out[0] = a[0] * scale + b[0];
    out[1] = a[1] * scale + b[1];
    return out;
}

VecP Vec2_distance(Vec2 out, Vec2 a, Vec2 b){
    VecP x = b[0] - a[0];
    VecP y = b[1] - a[1];
    return sqrt((x*x + y*y));
}


VecP Vec2_squareDistance(Vec2 out, Vec2 a, Vec2 b){
    VecP x = b[0] - a[0];
    VecP y = b[1] - a[1];
    return x*x + y*y;
}

VecP Vec2_length(Vec2 a){
    return sqrt((a[0]*a[0] + a[1]*a[1]));
}

Vec2 Vec2_negate(Vec2 out, Vec2 a){
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
}

Vec2 Vec2_inverse(Vec2 out, Vec2 a){
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    return out;
}

Vec2 Vec2_normalize(Vec2 out, Vec2 a) {
  VecP len = a[0]*a[0] + a[1]*a[1];
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / sqrt(len);
  }
  out[0] = a[0] * len;
  out[1] = a[1] * len;
  return out;
}

VecP Vec2_dot(Vec2 a, Vec2 b){
    return a[0] * b[0] + a[1] * b[1];
}

Vec3 Vec2_cross(Vec3 out, Vec2 a, Vec2 b){
    VecP z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
  return out;
}

Vec2 Vec2_lerp(Vec2 out,Vec2 a,Vec2 b,VecP t) {
  VecP ax = a[0],
    ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}

Vec2 Vec2_random(Vec2 out,VecP scale) {
  VecP r = random() * 2.0 * M_PI;
  out[0] = cos(r) * scale;
  out[1] = sin(r) * scale;
  return out;
}

Vec2 Vec2_transformMat2(Vec2 out, Vec2 a, Mat2 m) {
  VecP x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
}

Vec2 Vec2_transformMat2d(Vec2 out, Vec2 a, Mat2d m) {
  VecP x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}

Vec2 Vec2_transformMat3(Vec2 out, Vec2 a, Mat3 m) {
  VecP x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}

Vec2 Vec2_transformMat4(Vec2 out, Vec2 a, Mat4 m) {
  VecP x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}

Vec2 Vec2_rotate(Vec2 out,Vec2  a,Vec2  b,VecP rad) {
  //Translate point to the origin
  VecP p0 = a[0] - b[0],
  p1 = a[1] - b[1],
  sinC = sin(rad),
  cosC = cos(rad);

  //perform rotation and translate to correct position
  out[0] = p0*cosC - p1*sinC + b[0];
  out[1] = p0*sinC + p1*cosC + b[1];

  return out;
}

VecP Vec2_angle(Vec2 a,Vec2 b) {
  VecP x1 = a[0],
    y1 = a[1],
    x2 = b[0],
    y2 = b[1];

  VecP len1 = x1*x1 + y1*y1;
  if (len1 > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len1 = 1 / sqrt(len1);
  }

  VecP len2 = x2*x2 + y2*y2;
  if (len2 > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len2 = 1 / sqrt(len2);
  }

  VecP cosine = (x1 * x2 + y1 * y2) * len1 * len2;

  if(cosine > 1.0) {
    return 0;
  }
  else if(cosine < -1.0) {
    return M_PI;
  } else {
    return acos(cosine);
  }
}

Vec2 Vec2_zero(Vec2 out){
    out[0] = 0;
    out[1] = 0;
    return out;
}

bool Vec2_equals(Vec2 a, Vec2 b){
    return a[0] == b[0] && a[1] == b[1];
}