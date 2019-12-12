#include "./glmatrix.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>

const VecP IDENT_MAT4[16] = {
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
};

Mat4 Mat4_create(){
    Mat4 out = malloc(sizeof(VecP) * 16);

    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;

    return out;
}

Mat4 Mat4_clone(Mat4 a){
    Mat4 out = malloc(sizeof(VecP) * 16);

    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];

    return out;
}

Mat4 Mat4_copy(Mat4 out, Mat4 a){

    out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];

    return out;
}

Mat4 Mat4_identity(Mat4 out){
      out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

    return out;
}

Mat4 Mat4_fromValues(VecP m00, VecP m01, VecP m02, VecP m03, VecP m10, VecP m11, VecP m12, VecP m13, VecP m20, VecP m21, VecP m22, VecP m23, VecP m30, VecP m31, VecP m32, VecP m33) {
  Mat4 out = malloc(sizeof(VecP) * 16);
  
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;

  return out;
}

Mat4 Mat4_set(Mat4 out, VecP m00, VecP m01, VecP m02, VecP m03, VecP m10, VecP m11, VecP m12, VecP m13, VecP m20, VecP m21, VecP m22, VecP m23, VecP m30, VecP m31, VecP m32, VecP m33) {
  
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;

  return out;
}

Mat4 Mat4_transpose(Mat4 out, Mat4 a) {
  
  if (out == a) {
    VecP a01 = a[1], a02 = a[2], a03 = a[3];
    VecP a12 = a[6], a13 = a[7];
    VecP a23 = a[11];

    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }
  return out;
}

Mat4 Mat4_invert(Mat4 out, Mat4 a) {
   VecP a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  VecP a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  VecP a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  VecP a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  VecP b00 = a00 * a11 - a01 * a10;
  VecP b01 = a00 * a12 - a02 * a10;
  VecP b02 = a00 * a13 - a03 * a10;
  VecP b03 = a01 * a12 - a02 * a11;
  VecP b04 = a01 * a13 - a03 * a11;
  VecP b05 = a02 * a13 - a03 * a12;
  VecP b06 = a20 * a31 - a21 * a30;
  VecP b07 = a20 * a32 - a22 * a30;
  VecP b08 = a20 * a33 - a23 * a30;
  VecP b09 = a21 * a32 - a22 * a31;
  VecP b10 = a21 * a33 - a23 * a31;
  VecP b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  VecP det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return NULL;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
}

Mat4 Mat4_adjoint(Mat4 out, Mat4 a) {
  VecP a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  VecP a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  VecP a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  VecP a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
  out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
  out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
  out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
  out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
  out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
  return out;
}

VecP Mat4_determinant(Mat4 a){
  VecP a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  VecP a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  VecP a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  VecP a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  VecP b00 = a00 * a11 - a01 * a10;
  VecP b01 = a00 * a12 - a02 * a10;
  VecP b02 = a00 * a13 - a03 * a10;
  VecP b03 = a01 * a12 - a02 * a11;
  VecP b04 = a01 * a13 - a03 * a11;
  VecP b05 = a02 * a13 - a03 * a12;
  VecP b06 = a20 * a31 - a21 * a30;
  VecP b07 = a20 * a32 - a22 * a30;
  VecP b08 = a20 * a33 - a23 * a30;
  VecP b09 = a21 * a32 - a22 * a31;
  VecP b10 = a21 * a33 - a23 * a31;
  VecP b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}


Mat4 Mat4_multiply(Mat4 out, Mat4 a, Mat4 b) {
  VecP a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  VecP a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  VecP a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  VecP a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  // Cache only the current line of the second matrix
  VecP b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
  return out;
}

Mat4 Mat4_translate(Mat4 out, Mat4 a, Vec2 v) {
   VecP x = v[0], y = v[1], z = v[2];
  VecP a00, a01, a02, a03;
  VecP a10, a11, a12, a13;
  VecP a20, a21, a22, a23;

  if (a == out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
    out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
    out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }
  return out;
}

Mat4 Mat4_scale(Mat4 out, Mat4 a, Mat4 v) {
  VecP x = v[0], y = v[1], z = v[2];

  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

Mat4 Mat4_rotate(Mat4 out, Mat4 a, VecP rad, Vec3 axis) {
  VecP x = axis[0], y = axis[1], z = axis[2];
  VecP len = sqrt(x*x+y*y+z*z);
  VecP s, c, t;
  VecP a00, a01, a02, a03;
  VecP a10, a11, a12, a13;
  VecP a20, a21, a22, a23;
  VecP b00, b01, b02;
  VecP b10, b11, b12;
  VecP b20, b21, b22;

  if (len == 0) { return NULL; }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = sin(rad);
  c = cos(rad);
  t = 1 - c;

  a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
  a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
  a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

  // Construct the elements of the rotation matrix
  b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
  b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
  b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

  // Perform rotation-specific matrix multiplication
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a != out) { // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}

Mat4 Mat4_rotateX(Mat4 out, Mat4 a, VecP rad) {
  VecP s = sin(rad);
  VecP c = cos(rad);
  VecP a10 = a[4];
  VecP a11 = a[5];
  VecP a12 = a[6];
  VecP a13 = a[7];
  VecP a20 = a[8];
  VecP a21 = a[9];
  VecP a22 = a[10];
  VecP a23 = a[11];

  if (a != out) { // If the source and destination differ, copy the unchanged rows
    out[0]  = a[0];
    out[1]  = a[1];
    out[2]  = a[2];
    out[3]  = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}

Mat4 Mat4_rotateY(Mat4 out, Mat4 a, VecP rad) {
VecP s = sin(rad);
  VecP c = cos(rad);
  VecP a00 = a[0];
  VecP a01 = a[1];
  VecP a02 = a[2];
  VecP a03 = a[3];
  VecP a20 = a[8];
  VecP a21 = a[9];
  VecP a22 = a[10];
  VecP a23 = a[11];

  if (a != out) { // If the source and destination differ, copy the unchanged rows
    out[4]  = a[4];
    out[5]  = a[5];
    out[6]  = a[6];
    out[7]  = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}

Mat4 Mat4_rotateZ(Mat4 out, Mat4 a, VecP rad) {
  VecP s = sin(rad);
  VecP c = cos(rad);
  VecP a00 = a[0];
  VecP a01 = a[1];
  VecP a02 = a[2];
  VecP a03 = a[3];
  VecP a10 = a[4];
  VecP a11 = a[5];
  VecP a12 = a[6];
  VecP a13 = a[7];

  if (a != out) { // If the source and destination differ, copy the unchanged last row
    out[8]  = a[8];
    out[9]  = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}

Mat4 Mat4_fromTranslation(Mat4 out, Vec2 v) {
    out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

    return out;
}


Mat4 Mat4_fromScaling(Mat4 out, Vec2 v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

Mat4 Mat4_fromRotation(Mat4 out, VecP rad, Vec3 axis) {
  VecP x = axis[0], y = axis[1], z = axis[2];
  VecP len = sqrt(x*x + y*y + z*z);
  VecP s, c, t;

  //if (len < glMatrix.EPSILON) { return null; }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = sin(rad);
  c = cos(rad);
  t = 1 - c;

  // Perform rotation-specific matrix multiplication
  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

Mat4 Mat4_fromXRotation(Mat4 out, VecP rad) {
  VecP s = sin(rad);
  VecP c = cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = 1;
  out[1]  = 0;
  out[2]  = 0;
  out[3]  = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}


Mat4 Mat4_fromYRotation(Mat4 out, VecP rad) {
  VecP s = sin(rad);
  VecP c = cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = c;
  out[1]  = 0;
  out[2]  = -s;
  out[3]  = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

Mat4 Mat4_fromZRotation(Mat4 out, VecP rad) {
  VecP s = sin(rad);
  VecP c = cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = c;
  out[1]  = s;
  out[2]  = 0;
  out[3]  = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}


Mat4 Mat4_fromRotationTranslation(Mat4 out,Quat q, Vec3 v) {
  VecP x = q[0], y = q[1], z = q[2], w = q[3];
  VecP x2 = x + x;
  VecP y2 = y + y;
  VecP z2 = z + z;

  VecP xx = x * x2;
  VecP xy = x * y2;
  VecP xz = x * z2;
  VecP yy = y * y2;
  VecP yz = y * z2;
  VecP zz = z * z2;
  VecP wx = w * x2;
  VecP wy = w * y2;
  VecP wz = w * z2;

  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}

VecP __tempMV3[3];

Mat4 Mat4_fromQuat2(Mat4 out, Quat2 a) {
  //Vec4 translation = new glMatrix.ARRAY_TYPE(3);
  VecP bx = -a[0], by = -a[1], bz = -a[2], bw = a[3],
  ax = a[4], ay = a[5], az = a[6], aw = a[7];

  VecP magnitude = bx * bx + by * by + bz * bz + bw * bw;
  //Only scale if it makes sense
  if (magnitude > 0) {
    __tempMV3[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    __tempMV3[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    __tempMV3[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    __tempMV3[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    __tempMV3[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    __tempMV3[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }
  Mat4_fromRotationTranslation(out, a, (Vec3)__tempMV3);
  return out;
}


Vec3 Mat4_getTranslation(Vec3 out, Mat4 mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];

  return out;
}

Vec3 Mat4_getScaling(Vec3 out, Mat4 mat){
  VecP m11 = mat[0];
  VecP m12 = mat[1];
  VecP m13 = mat[2];
  VecP m21 = mat[4];
  VecP m22 = mat[5];
  VecP m23 = mat[6];
  VecP m31 = mat[8];
  VecP m32 = mat[9];
  VecP m33 = mat[10];

  out[0] = sqrt(m11*m11 + m12*m12 + m12*m12);
  out[1] = sqrt(m21*m21 + m22*m22 + m22*m22);
  out[2] = sqrt(m31*m31 + m32*m32 + m32*m32);

  return out;
}

Quat Mat4_getRotation(Quat out, Mat4 mat){

  Mat4_getScaling((Vec3)__tempMV3, mat);

  VecP is1 = 1 / __tempMV3[0];
  VecP is2 = 1 / __tempMV3[1];
  VecP is3 = 1 / __tempMV3[2];

  VecP sm11 = mat[0] * is1;
  VecP sm12 = mat[1] * is2;
  VecP sm13 = mat[2] * is3;
  VecP sm21 = mat[4] * is1;
  VecP sm22 = mat[5] * is2;
  VecP sm23 = mat[6] * is3;
  VecP sm31 = mat[8] * is1;
  VecP sm32 = mat[9] * is2;
  VecP sm33 = mat[10] * is3;

  VecP trace = sm11 + sm22 + sm33;
  VecP S = 0;

  if (trace > 0) {
    S = sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if ((sm11 > sm22) && (sm11 > sm33)) {
    S = sqrt(1.0 + sm11 - sm22- sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }

  return out;
}

Mat4 Mat4_fromRotationTranslationScale(Mat4 out, Quat q, Vec3 v, Vec3 s) {
    VecP x = q[0], y = q[1], z = q[2], w = q[3];
  VecP x2 = x + x;
  VecP y2 = y + y;
  VecP z2 = z + z;

  VecP xx = x * x2;
  VecP xy = x * y2;
  VecP xz = x * z2;
  VecP yy = y * y2;
  VecP yz = y * z2;
  VecP zz = z * z2;
  VecP wx = w * x2;
  VecP wy = w * y2;
  VecP wz = w * z2;
  VecP sx = s[0];
  VecP sy = s[1];
  VecP sz = s[2];

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}


Mat4 Mat4_fromRotationTranslationScaleOrigin(Mat4 out, Quat q, Vec3 v, Vec3 s, Vec3 o) {
  // Quaternion math
  VecP x = q[0], y = q[1], z = q[2], w = q[3];
  VecP x2 = x + x;
  VecP y2 = y + y;
  VecP z2 = z + z;

  VecP xx = x * x2;
  VecP xy = x * y2;
  VecP xz = x * z2;
  VecP yy = y * y2;
  VecP yz = y * z2;
  VecP zz = z * z2;
  VecP wx = w * x2;
  VecP wy = w * y2;
  VecP wz = w * z2;

  VecP sx = s[0];
  VecP sy = s[1];
  VecP sz = s[2];

  VecP ox = o[0];
  VecP oy = o[1];
  VecP oz = o[2];

  VecP out0 = (1 - (yy + zz)) * sx;
  VecP out1 = (xy + wz) * sx;
  VecP out2 = (xz - wy) * sx;
  VecP out4 = (xy - wz) * sy;
  VecP out5 = (1 - (xx + zz)) * sy;
  VecP out6 = (yz + wx) * sy;
  VecP out8 = (xz + wy) * sz;
  VecP out9 = (yz - wx) * sz;
  VecP out10 = (1 - (xx + yy)) * sz;

  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;

  return out;
}

Mat4 Mat4_fromQuat(Mat4 out, Quat q) {
  VecP x = q[0], y = q[1], z = q[2], w = q[3];
  VecP x2 = x + x;
  VecP y2 = y + y;
  VecP z2 = z + z;

  VecP xx = x * x2;
  VecP yx = y * x2;
  VecP yy = y * y2;
  VecP zx = z * x2;
  VecP zy = z * y2;
  VecP zz = z * z2;
  VecP wx = w * x2;
  VecP wy = w * y2;
  VecP wz = w * z2;

  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;

  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;

  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;

  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

  return out;
}

Mat4 Mat4_frustum(Mat4 out, VecP left,VecP right,VecP bottom,VecP top,VecP near,VecP far) {
  VecP rl = 1 / (right - left);
  VecP tb = 1 / (top - bottom);
  VecP nf = 1 / (near - far);
  out[0] = (near * 2) * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = (near * 2) * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = (far * near * 2) * nf;
  out[15] = 0;
  return out;
}

Mat4 Mat4_perspective(Mat4 out,VecP fovy,VecP aspect,VecP near,VecP far) {
  VecP f = 1.0 / tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != 0) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = (2 * far * near) * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }
  return out;
}

Mat4 Mat4_perspectiveFromFieldOfView(Mat4 out, struct Fov* fov, VecP near, VecP far) {
  VecP upTan = tan(fov->upDegrees * M_PI/180.0);
  VecP downTan = tan(fov->downDegrees * M_PI/180.0);
  VecP leftTan = tan(fov->leftDegrees * M_PI/180.0);
  VecP rightTan = tan(fov->rightDegrees * M_PI/180.0);
  VecP xScale = 2.0 / (leftTan + rightTan);
  VecP yScale = 2.0 / (upTan + downTan);

  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = ((upTan - downTan) * yScale * 0.5);
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = (far * near) / (near - far);
  out[15] = 0.0;
  return out;
}

Mat4 Mat4_ortho(Mat4 out, VecP left, VecP right, VecP bottom, VecP top, VecP near, VecP far) {
    VecP lr = 1 / (left - right);
  VecP bt = 1 / (bottom - top);
  VecP nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}


Mat4 Mat4_lookAt(Mat4 out, Vec3 eye, Vec3 center, Vec3 up) {
  VecP x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  VecP eyex = eye[0];
  VecP eyey = eye[1];
  VecP eyez = eye[2];
  VecP upx = up[0];
  VecP upy = up[1];
  VecP upz = up[2];
  VecP centerx = center[0];
  VecP centery = center[1];
  VecP centerz = center[2];
  if(
      abs((int)(eyey - centery)) == 0 &&
      abs((int)(eyez - centerz)) == 0) {
    return Mat4_identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;

  len = 1 / sqrt(z0*z0 * z1*z1 * z2*z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;

  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = sqrt(x0*x0 * x1*x1 * x2*x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;

  len = sqrt(y0*y0 + y1*y1 + y2*y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;

  return out;
}

Mat4 Mat4_targetTo(Mat4 out, Vec3 eye, Vec3 target, Vec3 up) {
  VecP eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];

  VecP z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];

  VecP len = z0*z0 + z1*z1 + z2*z2;
  if (len > 0) {
    len = 1 / sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  VecP x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;

  len = x0*x0 + x1*x1 + x2*x2;
  if (len > 0) {
    len = 1 / sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
};

VecP Mat4_frob(Mat4 out, Mat4 a, VecP v) {
  return sqrt(a[0]*a[0]+a[1]*a[1]+a[3]*a[3]+a[4]*a[4]+a[5]*a[5]+a[6]*a[6]+a[7]*a[7]+a[8]*a[8]+a[9]*a[9]+a[10]*a[10]+a[11]*a[11]+a[12]*a[12]+a[13]*a[13]+a[14]*a[14]+a[15]*a[15]);
}

Mat4 Mat4_add(Mat4 out, Mat4 a, Mat4 b) {
 out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}

Mat4 Mat4_substract(Mat4 out, Mat4 a, Mat4 b) {
   out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}



Mat4 Mat4_multiplyScalar(Mat4 out, Mat4 a, VecP b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}

Mat4 Mat4_multiplyScalarAndAdd(Mat4 out, Mat4 a, Mat4 b, VecP scale) {
   out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  out[6] = a[6] + (b[6] * scale);
  out[7] = a[7] + (b[7] * scale);
  out[8] = a[8] + (b[8] * scale);
  out[9] = a[9] + (b[9] * scale);
  out[10] = a[10] + (b[10] * scale);
  out[11] = a[11] + (b[11] * scale);
  out[12] = a[12] + (b[12] * scale);
  out[13] = a[13] + (b[13] * scale);
  out[14] = a[14] + (b[14] * scale);
  out[15] = a[15] + (b[15] * scale);
  return out;
}

bool Mat4_equal(Mat4 a, Vec2 b){
 return a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && a[3] == b[3] &&
         a[4] == b[4] && a[5] == b[5] && a[6] == b[6] && a[7] == b[7] &&
         a[8] == b[8] && a[9] == b[9] && a[10] == b[10] && a[11] == b[11] &&
         a[12] == b[12] && a[13] == b[13] && a[14] == b[14] && a[15] == b[15];
}
