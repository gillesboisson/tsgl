#include "./glmatrix.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>

Mat2 Mat2_create(){
    Mat2 out = malloc(sizeof(VecP) * 4);

    out[1] = 0;
    out[2] = 0;
    out[0] = 1;
    out[3] = 1;

    return out;
}


Mat2 Mat2_clone(Mat2 a){
    Mat2 out = malloc(sizeof(VecP) * 4);

    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];

    return out;
}

Mat2 Mat2_copy(Mat2 out, Mat2 a){

    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];

    return out;
}


Mat2 Mat2_identity(Mat2 out){
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;

    return out;
}

Mat2 Mat2_fromValues(VecP m00, VecP m01, VecP m10, VecP m11) {
  Mat2 out = malloc(sizeof(VecP) * 4);
  
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}

Mat2 Mat2_set(Mat2 out, VecP m00, VecP m01, VecP m10, VecP m11) {
  
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}

Mat2 Mat2_transpose(Mat2 out, Mat2 a) {
  
  if (out == a) {
    VecP a1 = a[1];
    out[1] = a[2];
    out[2] = a1;
  } else {
    out[0] = a[0];
    out[1] = a[2];
    out[2] = a[1];
    out[3] = a[3];
  }
  return out;
}

Mat2 Mat2_invert(Mat2 out, Mat2 a) {
    VecP a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];

  // Calculate the determinant
  VecP det = a0 * a3 - a2 * a1;

  if (!det) {
    return NULL;
  }
  det = 1.0 / det;

  out[0] =  a3 * det;
  out[1] = -a1 * det;
  out[2] = -a2 * det;
  out[3] =  a0 * det;

  return out;
}

Mat2 Mat2_adjoint(Mat2 out, Mat2 a) {
    VecP a0 = a[0];
  out[0] =  a[3];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] =  a0;
  return out;
}

VecP Mat2_determinant(Mat2 a){
    return a[0] * a[3] - a[2] * a[1];
}


Mat2 Mat2_multiply(Mat2 out, Mat2 a, Mat2 b) {
  VecP a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  VecP b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  return out;
}

Mat2 Mat2_rotate(Mat2 out, Mat2 a, VecP rad) {
  VecP a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  VecP s = sin(rad);
  VecP c = cos(rad);
  out[0] = a0 *  c + a2 * s;
  out[1] = a1 *  c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  return out;
}

Mat2 Mat2_scale(Mat2 out, Mat2 a, Mat2 v) {
  VecP a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  VecP v0 = v[0], v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  return out;
}

Mat2 Mat2_fromRotation(Mat2 out, VecP rad) {
  VecP s = sin(rad);
  VecP c = cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  return out;
}

Mat2 Mat2_fromScaling(Mat2 out, Vec2 v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  return out;
}

VecP Mat2_frob(Mat2 out, Mat2 a, VecP v) {
  return sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]+a[3]*a[3]);
}

void Mat2_LDU(Mat2 L,Mat2 D,Mat2 U,Mat2 a){
  L[2] = a[2]/a[0];
  U[0] = a[0];
  U[1] = a[1];
  U[3] = a[3] - L[2] * U[1];
}


Mat2 Mat2_add(Mat2 out, Mat2 a, Vec2 b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}

Mat2 Mat2_substract(Mat2 out, Mat2 a, Vec2 b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}

bool Mat2_equal(Mat2 a, Vec2 b){
 return a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && a[3] == b[3];
}


Mat2 Mat2_multiplyScalar(Mat2 out, Mat2 a, VecP b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}

Mat2 Mat2_multiplyScalarAndAdd(Mat2 out, Mat2 a, Mat2 b, VecP scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  return out;
}