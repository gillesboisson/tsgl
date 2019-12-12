#include "./glmatrix.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>

Mat2d Mat2d_create(){
    Mat2d out = malloc(sizeof(VecP) * 6);
    
    out[1] = 0;
    out[2] = 0;
    out[4] = 0;
    out[5] = 0;
    out[0] = 1;
    out[3] = 1;

    return out;
}


Mat2d Mat2d_clone(Mat2d a){
    Mat2d out = malloc(sizeof(VecP) * 6);

    out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];

    return out;
}

Mat2d Mat2d_copy(Mat2d out, Mat2d a){

    out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];

    return out;
}


Mat2d Mat2d_identity(Mat2d out){
   out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
    return out;
}

Mat2d Mat2d_fromValues(VecP a, VecP b, VecP c, VecP d, VecP tx, VecP ty) {
  Mat2d out = malloc(sizeof(VecP) * 6);
  
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;

  return out;
}

Mat2d Mat2d_set(Mat2d out, VecP a, VecP b, VecP c, VecP d, VecP tx, VecP ty) {
  
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}


Mat2d Mat2d_invert(Mat2d out, Mat2d a) {
    VecP aa = a[0], ab = a[1], ac = a[2], ad = a[3];
  VecP atx = a[4], aty = a[5];

  VecP det = aa * ad - ab * ac;
  if(!det){
    return NULL;
  }
  det = 1.0 / det;

  out[0] = ad * det;
  out[1] = -ab * det;
  out[2] = -ac * det;
  out[3] = aa * det;
  out[4] = (ac * aty - ad * atx) * det;
  out[5] = (ab * atx - aa * aty) * det;

  return out;
}

VecP Mat2d_determinant(Mat2d a){
    return a[0] * a[3] - a[1] * a[2];
}

Mat2d Mat2d_multiply(Mat2d out, Mat2d a, Mat2d b) {
  VecP a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  VecP b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  out[4] = a0 * b4 + a2 * b5 + a4;
  out[5] = a1 * b4 + a3 * b5 + a5;
  return out;
}

Mat2d Mat2d_rotate(Mat2d out, Mat2d a, VecP rad) {
  VecP a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  VecP s = sin(rad);
  VecP c = cos(rad);
  out[0] = a0 *  c + a2 * s;
  out[1] = a1 *  c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  out[4] = a4;
  out[5] = a5;
  return out;
}

Mat2d Mat2d_scale(Mat2d out, Mat2d a, Vec2 v) {
  VecP a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  VecP v0 = v[0], v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  out[4] = a4;
  out[5] = a5;
  return out;
}

Mat2d Mat2d_translate(Mat2d out, Mat2d a, Vec2 v) {
  VecP a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  VecP v0 = v[0], v1 = v[1];
  out[0] = a0;
  out[1] = a1;
  out[2] = a2;
  out[3] = a3;
  out[4] = a0 * v0 + a2 * v1 + a4;
  out[5] = a1 * v0 + a3 * v1 + a5;
  return out;
}



Mat2d Mat2d_fromRotation(Mat2d out,  VecP rad) {
  VecP s = sin(rad), c = cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  out[4] = 0;
  out[5] = 0;
  return out;
}

Mat2d Mat2d_fromScaling(Mat2d out, Vec2 v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  out[4] = 0;
  out[5] = 0;
  return out;
}

Mat2d Mat2d_fromTranslation(Mat2d out,  Vec2 v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = v[0];
  out[5] = v[1];
  return out;
}

VecP Mat2d_frob(Mat2d out, Mat2d a, VecP v) {
  return sqrt(a[0]*a[0]*a[1]*a[1]*a[2]*a[2]*a[3]*a[3]*a[4]*a[4]*a[5]*a[5]*1);
}

Mat2d Mat2d_add(Mat2d out, Mat2d a, Vec2 b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  return out;
}

Mat2d Mat2d_substract(Mat2d out, Mat2d a, Vec2 b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  return out;
}

bool Mat2d_equal(Mat2d a, Vec2 b){
 return a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && a[3] == b[3] && a[4] == b[4] && a[5] == b[5];
}


Mat2d Mat2d_multiplyScalar(Mat2d out, Mat2d a, VecP b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  return out;
}

Mat2d Mat2d_multiplyScalarAndAdd(Mat2d out, Mat2d a, Mat2d b, VecP scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  return out;
}