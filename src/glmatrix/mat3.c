#include "./glmatrix.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>

Mat3 Mat3_create(){
    Mat3 out = malloc(sizeof(VecP) * 9);

    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[0] = 1;
    out[4] = 1;
    out[8] = 1;

    return out;
}

Mat3 Mat3_fromMat4(Mat3 out, Mat4 a){
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
}

Mat3 Mat3_clone(Mat3 a){
    Mat3 out = malloc(sizeof(VecP) * 9);

    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];

    return out;
}

Mat3 Mat3_copy(Mat3 out, Mat3 a){

    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];

    return out;
}

Mat3 Mat3_identity(Mat3 out){
      out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;

    return out;
}

Mat3 Mat3_fromValues(VecP m00, VecP m01, VecP m02, VecP m10, VecP m11, VecP m12, VecP m20, VecP m21, VecP m22) {
  Mat3 out = malloc(sizeof(VecP) * 9);
  
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;

  return out;
}

Mat3 Mat3_set(Mat3 out, VecP m00, VecP m01, VecP m02, VecP m10, VecP m11, VecP m12, VecP m20, VecP m21, VecP m22) {
  
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;

  return out;
}

Mat3 Mat3_transpose(Mat3 out, Mat3 a) {
  
  if (out == a) {
    VecP a01 = a[1], a02 = a[2], a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }
  return out;
}

Mat3 Mat3_invert(Mat3 out, Mat3 a) {
    VecP a00 = a[0], a01 = a[1], a02 = a[2];
  VecP a10 = a[3], a11 = a[4], a12 = a[5];
  VecP a20 = a[6], a21 = a[7], a22 = a[8];

  VecP b01 = a22 * a11 - a12 * a21;
  VecP b11 = -a22 * a10 + a12 * a20;
  VecP b21 = a21 * a10 - a11 * a20;

  // Calculate the determinant
  VecP det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return NULL;
  }
  det = 1.0 / det;

  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;

  return out;
}

Mat3 Mat3_adjoint(Mat3 out, Mat3 a) {
  VecP a00 = a[0], a01 = a[1], a02 = a[2];
  VecP a10 = a[3], a11 = a[4], a12 = a[5];
  VecP a20 = a[6], a21 = a[7], a22 = a[8];

  out[0] = (a11 * a22 - a12 * a21);
  out[1] = (a02 * a21 - a01 * a22);
  out[2] = (a01 * a12 - a02 * a11);
  out[3] = (a12 * a20 - a10 * a22);
  out[4] = (a00 * a22 - a02 * a20);
  out[5] = (a02 * a10 - a00 * a12);
  out[6] = (a10 * a21 - a11 * a20);
  out[7] = (a01 * a20 - a00 * a21);
  out[8] = (a00 * a11 - a01 * a10);
  return out;
}

VecP Mat3_determinant(Mat3 a){
  VecP a00 = a[0], a01 = a[1], a02 = a[2];
  VecP a10 = a[3], a11 = a[4], a12 = a[5];
  VecP a20 = a[6], a21 = a[7], a22 = a[8];

  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}


Mat3 Mat3_multiply(Mat3 out, Mat3 a, Mat3 b) {
  VecP a00 = a[0], a01 = a[1], a02 = a[2];
  VecP a10 = a[3], a11 = a[4], a12 = a[5];
  VecP a20 = a[6], a21 = a[7], a22 = a[8];

  VecP b00 = b[0], b01 = b[1], b02 = b[2];
  VecP b10 = b[3], b11 = b[4], b12 = b[5];
  VecP b20 = b[6], b21 = b[7], b22 = b[8];

  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;

  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;

  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}

Mat3 Mat3_translate(Mat3 out, Mat3 a, Vec2 v) {
   VecP a00 = a[0], a01 = a[1], a02 = a[2],
    a10 = a[3], a11 = a[4], a12 = a[5],
    a20 = a[6], a21 = a[7], a22 = a[8],
    x = v[0], y = v[1];

  out[0] = a00;
  out[1] = a01;
  out[2] = a02;

  out[3] = a10;
  out[4] = a11;
  out[5] = a12;

  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}

Mat3 Mat3_rotate(Mat3 out, Mat3 a, VecP rad) {
  VecP a00 = a[0], a01 = a[1], a02 = a[2],
    a10 = a[3], a11 = a[4], a12 = a[5],
    a20 = a[6], a21 = a[7], a22 = a[8],

    s = sin(rad),
    c = cos(rad);

  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;

  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;

  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
};

Mat3 Mat3_scale(Mat3 out, Mat3 a, Mat3 v) {
  VecP x = v[0], y = v[1];

  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];

  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];

  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

Mat3 Mat3_fromTranslation(Mat3 out, Vec2 v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = v[0];
    out[7] = v[1];
    out[8] = 1;

    return out;
}
Mat3 Mat3_fromRotation(Mat3 out, VecP rad) {
  VecP s = sin(rad), c = cos(rad);

  out[0] = c;
  out[1] = s;
  out[2] = 0;

  out[3] = -s;
  out[4] = c;
  out[5] = 0;

  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

Mat3 Mat3_fromScaling(Mat3 out, Vec2 v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;

  out[3] = 0;
  out[4] = v[1];
  out[5] = 0;

  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

Mat3 Mat3_fromMat2d(Mat3 out, Mat2d a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = 0;

  out[3] = a[2];
  out[4] = a[3];
  out[5] = 0;

  out[6] = a[4];
  out[7] = a[5];
  out[8] = 1;
  return out;
}


Mat3 Mat3_fromQuat(Mat3 out, Quat q) {
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
  out[3] = yx - wz;
  out[6] = zx + wy;

  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;

  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;
  return out;
}


Mat3 Mat3_normalFromMat4(Mat3 out, Mat4 a) {
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
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  return out;
}


Mat3 Mat3_projection(Mat3 out, VecP width, VecP height) {
    out[0] = 2 / width;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = -2 / height;
    out[5] = 0;
    out[6] = -1;
    out[7] = 1;
    out[8] = 1;
    return out;
}

VecP Mat3_frob(Mat3 out, Mat3 a, VecP v) {
  return sqrt(a[0]*a[0]*a[1]*a[1]*a[2]*a[2]*a[3]*a[3]*a[4]*a[4]*a[5]*a[5]*a[6]*a[6]*a[7]*a[7]*a[8]*a[8]);
}

Mat3 Mat3_add(Mat3 out, Mat3 a, Vec2 b) {
    out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  return out;
}

Mat3 Mat3_substract(Mat3 out, Mat3 a, Vec2 b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  return out;
}

bool Mat3_equal(Mat3 a, Vec2 b){
 return a[0] == b[0] && a[1] == b[1] && a[2] == b[2] &&
         a[3] == b[3] && a[4] == b[4] && a[5] == b[5] &&
         a[6] == b[6] && a[7] == b[7] && a[8] == b[8];
}


Mat3 Mat3_multiplyScalar(Mat3 out, Mat3 a, VecP b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  return out;
}

Mat3 Mat3_multiplyScalarAndAdd(Mat3 out, Mat3 a, Mat3 b, VecP scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  out[6] = a[6] + (b[6] * scale);
  out[7] = a[7] + (b[7] * scale);
  out[8] = a[8] + (b[8] * scale);
  return out;
}