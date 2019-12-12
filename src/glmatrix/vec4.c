#include "./glmatrix.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>


Vec4 Vec4_create(){
    Vec4 out = calloc(sizeof(VecP), 4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
}

Vec4 Vec4_clone(Vec4 v){
    Vec4 out = malloc(4 * sizeof(VecP));
    out[0] = v[0];
    out[1] = v[1];
    out[2] = v[2];
    out[3] = v[3];
    return out;
}


VecP Vec4_length(Vec4 a){
    return sqrt((a[0]*a[0] + a[1]*a[1] + a[2]*a[2] + a[3]*a[3]));
}

Vec4 Vec4_fromValues(VecP x, VecP y, VecP z, VecP w){
    Vec4 out = malloc(4 * sizeof(VecP));
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
}

Vec4 Vec4_copy(Vec4 out, Vec4 input){
    out[0] = input[0];
    out[1] = input[1];
    out[2] = input[2];
    out[3] = input[3];
    return out;
}

Vec4 Vec4_set(Vec4 out, VecP x, VecP y, VecP z, VecP w){
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
}

Vec4 Vec4_add(Vec4 out, Vec4 a, Vec4 b){
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
}

Vec4 Vec4_subtract(Vec4 out, Vec4 a, Vec4 b){
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
}

Vec4 Vec4_multiply(Vec4 out, Vec4 a, Vec4 b){
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
}

Vec4 Vec4_divide(Vec4 out, Vec4 a, Vec4 b){
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
}


Vec4 Vec4_ceil(Vec4 out, Vec4 a){
    out[0] = ceil(a[0]);
    out[1] = ceil(a[1]);
    out[2] = ceil(a[2]);
    out[3] = ceil(a[3]);
    return out;
}

Vec4 Vec4_floor(Vec4 out, Vec4 a){
    out[0] = floor(a[0]);
    out[1] = floor(a[1]);
    out[2] = floor(a[2]);
    out[3] = floor(a[3]);
    return out;
}


Vec4 Vec4_min(Vec4 out, Vec4 a, Vec4 b){
    out[0] = min(a[0], b[0]);
    out[1] = min(a[1], b[1]);
    out[2] = min(a[2], b[2]);
    out[3] = min(a[3], b[3]);

    return out;
}
Vec4 Vec4_max(Vec4 out, Vec4 a, Vec4 b){
    out[0] = max(a[0], b[0]);
    out[1] = max(a[1], b[1]);
    out[2] = max(a[2], b[2]);
    out[3] = max(a[3], b[3]);

    return out;
}

Vec4 Vec4_round(Vec4 out, Vec4 a){
    out[0] = round(a[0]);
    out[1] = round(a[1]);
    out[2] = round(a[2]);
    out[3] = round(a[3]);
    return out;
}

Vec4 Vec4_scale(Vec4 out, Vec4 a, VecP scale){
    out[0] = a[0] * scale;
    out[1] = a[1] * scale;
    out[2] = a[2] * scale;
    out[3] = a[3] * scale;
    return out;
}


Vec4 Vec4_scaleAndAdd(Vec4 out, Vec4 a, Vec4 b, VecP scale){
    out[0] = a[0] * scale + b[0];
    out[1] = a[1] * scale + b[1];
    out[2] = a[2] * scale + b[2];
    out[3] = a[3] * scale + b[3];
    return out;
}

VecP Vec4_distance(Vec4 out, Vec4 a, Vec4 b){
    VecP x = b[0] - a[0];
    VecP y = b[1] - a[1];
    VecP z = b[2] - a[2];
    VecP w = b[3] - a[3];
    return sqrt(x*x + y*y + z*z + w*w);
}


VecP Vec4_squareDistance(Vec4 out, Vec4 a, Vec4 b){
    VecP x = b[0] - a[0];
    VecP y = b[1] - a[1];
    VecP z = b[2] - a[2];
    VecP w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
}

VecP Vec4_squaredLength(Vec4 a) {
  VecP x = a[0];
  VecP y = a[1];
  VecP z = a[2];
  VecP w = a[3];
  return x*x + y*y + z*z + w*w;
}

Vec4 Vec4_negate(Vec4 out, Vec4 a){
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
}

Vec4 Vec4_inverse(Vec4 out, Vec4 a){
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    out[2] = 1 / a[2];
    out[3] = 1 / a[3];
    return out;
}

Vec4 Vec4_normalize(Vec4 out, Vec4 a) {
  VecP len = a[0]*a[0] + a[1]*a[1] + a[2]*a[2] + a[3]*a[3];
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / sqrt(len);
  }
  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  out[3] = a[3] * len;
  return out;
}

VecP Vec4_dot(Vec4 a, Vec4 b){
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]+ a[3] * b[3];
}

Vec4 Vec4_cross(Vec4 out, Vec4 u, Vec4 v, Vec4 w){
 VecP A = (v[0] * w[1]) - (v[1] * w[0]),
        B = (v[0] * w[2]) - (v[2] * w[0]),
        C = (v[0] * w[3]) - (v[3] * w[0]),
        D = (v[1] * w[2]) - (v[2] * w[1]),
        E = (v[1] * w[3]) - (v[3] * w[1]),
        F = (v[2] * w[3]) - (v[3] * w[2]);
    VecP G = u[0];
    VecP H = u[1];
    VecP I = u[2];
    VecP J = u[3];

    out[0] = (H * F) - (I * E) + (J * D);
    out[1] = -(G * F) + (I * C) - (J * B);
    out[2] = (G * E) - (H * C) + (J * A);
    out[3] = -(G * D) + (H * B) - (I * A);
  return out;
}

Vec4 Vec4_lerp(Vec4 out,Vec4 a,Vec4 b,VecP t) {
    VecP ax = a[0];
  VecP ay = a[1];
  VecP az = a[2];
  VecP aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}

Vec4 Vec4_random(Vec4 out, VecP scale) {
  scale = scale || 1.0;

  // Marsaglia, George. Choosing a Point from the Surface of a
  // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
  // http://projecteuclid.org/euclid.aoms/1177692644;
  VecP v1, v2, v3, v4;
  VecP s1, s2;
  do {
    v1 = random() * 2 - 1;
    v2 = random() * 2 - 1;
    s1 = v1 * v1 + v2 * v2;
  } while (s1 >= 1);
  do {
    v3 = random() * 2 - 1;
    v4 = random() * 2 - 1;
    s2 = v3 * v3 + v4 * v4;
  } while (s2 >= 1);

  VecP d = sqrt((1 - s1) / s2);
  out[0] = scale * v1;
  out[1] = scale * v2;
  out[2] = scale * v3 * d;
  out[3] = scale * v4 * d;
  return out;
}

Vec4 Vec4_transformMat4(Vec4 out, Vec4 a, Mat4 m) {
  VecP x = a[0], y = a[1], z = a[2], w = a[3];

  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}

Vec4 Vec4_transformQuat(Vec4 out, Vec4 a, Quat q) {
  VecP x = a[0], y = a[1], z = a[2];
  VecP qx = q[0], qy = q[1], qz = q[2], qw = q[3];

  // calculate quat * vec
  VecP ix = qw * x + qy * z - qz * y;
  VecP iy = qw * y + qz * x - qx * z;
  VecP iz = qw * z + qx * y - qy * x;
  VecP iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}

Vec4 Vec4_zero(Vec4 out){
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
}

bool Vec4_equals(Vec4 a, Vec4 b){
    return a[0] == b[0] && a[1] == b[1] && a[2] == b[2];
}