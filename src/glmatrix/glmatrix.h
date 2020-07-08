#ifndef GLMATRIX
#define GLMATRIX

#include <stdlib.h>
#include <stdbool.h>
#include <stdint.h>

typedef float VecP;
typedef VecP *Vec2;
typedef VecP *Vec3;
typedef VecP *Vec4;
typedef VecP *Mat2;
typedef VecP *Mat2d;
typedef VecP *Mat3;
typedef VecP *Mat4;
typedef VecP *Quat;
typedef VecP *Quat2;

extern const VecP IDENT_MAT4[16];
struct Fov
{
  VecP upDegrees;
  VecP downDegrees;
  VecP leftDegrees;
  VecP rightDegrees;
};

// Helpers ------------------------------------------------------------------------------------

VecP min(VecP a, VecP b);
VecP max(VecP a, VecP b);

// Vec3 ------------------------------------------------------------------------------------

Vec3 Vec3_create();
Vec3 Vec3_clone(Vec3 v);
VecP Vec3_length(Vec3 a);
Vec3 Vec3_fromValues(VecP x, VecP y, VecP z);
Vec3 Vec3_copy(Vec3 out, Vec3 input);
Vec3 Vec3_set(Vec3 out, VecP x, VecP y, VecP z);
Vec3 Vec3_add(Vec3 out, Vec3 a, Vec3 b);
Vec3 Vec3_subtract(Vec3 out, Vec3 a, Vec3 b);
Vec3 Vec3_multiply(Vec3 out, Vec3 a, Vec3 b);
Vec3 Vec3_divide(Vec3 out, Vec3 a, Vec3 b);
Vec3 Vec3_ceil(Vec3 out, Vec3 a);
Vec3 Vec3_floor(Vec3 out, Vec3 a);
Vec3 Vec3_min(Vec3 out, Vec3 a, Vec3 b);
Vec3 Vec3_max(Vec3 out, Vec3 a, Vec3 b);
Vec3 Vec3_round(Vec3 out, Vec3 a);
Vec3 Vec3_scale(Vec3 out, Vec3 a, VecP scale);
Vec3 Vec3_scaleAndAdd(Vec3 out, Vec3 a, Vec3 b, VecP scale);
VecP Vec3_distance(Vec3 out, Vec3 a, Vec3 b);
VecP Vec3_squareDistance(Vec3 out, Vec3 a, Vec3 b);
Vec3 Vec3_negate(Vec3 out, Vec3 a);
Vec3 Vec3_inverse(Vec3 out, Vec3 a);
Vec3 Vec3_normalize(Vec3 out, Vec3 a);
Vec3 Vec3_normalize(Vec3 out, Vec3 a);
VecP Vec3_dot(Vec3 a, Vec3 b);
Vec3 Vec3_cross(Vec3 out, Vec3 a, Vec3 b);
Vec3 Vec3_cross(Vec3 out, Vec3 a, Vec3 b);
Vec3 Vec3_lerp(Vec3 out, Vec3 a, Vec3 b, VecP t);
Vec3 Vec3_hermite(Vec3 out, Vec3 a, Vec3 b, Vec3 c, Vec3 d, VecP t);
Vec3 Vec3_bezier(Vec3 out, Vec3 a, Vec3 b, Vec3 c, Vec3 d, VecP t);
Vec3 Vec3_random(Vec3 out, VecP scale);
Vec3 Vec3_transformMat4(Vec3 out, Vec3 a, Mat4 m);
Vec3 Vec3_transformMat3(Vec3 out, Vec3 a, Mat3 m);
Vec3 transformQuat(Vec3 out, Vec3 a, Quat q);
Vec3 Vec3_rotateX(Vec3 out, Vec3 a, Vec3 b, VecP rad);
Vec3 Vec3_rotateY(Vec3 out, Vec3 a, Vec3 b, VecP rad);
Vec3 Vec3_rotateZ(Vec3 out, Vec3 a, Vec3 b, VecP rad);
VecP Vec3_angle(Vec3 a, Vec3 b);
Vec3 Vec3_zero(Vec3 out);
bool Vec3_equals(Vec3 a, Vec3 b);
void Vec3_print(Vec3 a);
VecP Vec3_len(Vec3 a);

// Vec4 ------------------------------------------------------------------------------------

Vec2 Vec2_create();
Vec2 Vec2_clone(Vec2 v);
Vec2 Vec2_fromValues(VecP x, VecP y);
Vec2 Vec2_copy(Vec2 out, Vec2 input);
Vec2 Vec2_set(Vec2 out, VecP x, VecP y);
Vec2 Vec2_add(Vec2 out, Vec2 a, Vec2 b);
Vec2 Vec2_subtract(Vec2 out, Vec2 a, Vec2 b);
Vec2 Vec2_multiply(Vec2 out, Vec2 a, Vec2 b);
Vec2 Vec2_divide(Vec2 out, Vec2 a, Vec2 b);
Vec2 Vec2_ceil(Vec2 out, Vec2 a);
Vec2 Vec2_floor(Vec2 out, Vec2 a);
Vec2 Vec2_min(Vec2 out, Vec2 a, Vec2 b);
Vec2 Vec2_max(Vec2 out, Vec2 a, Vec2 b);
Vec2 Vec2_round(Vec2 out, Vec2 a);
Vec2 Vec2_scale(Vec2 out, Vec2 a, VecP scale);
Vec2 Vec2_scaleAndAdd(Vec2 out, Vec2 a, Vec2 b, VecP scale);
VecP Vec2_distance(Vec2 out, Vec2 a, Vec2 b);
VecP Vec2_squareDistance(Vec2 out, Vec2 a, Vec2 b);
VecP Vec2_length(Vec2 a);
Vec2 Vec2_negate(Vec2 out, Vec2 a);
Vec2 Vec2_inverse(Vec2 out, Vec2 a);
Vec2 Vec2_normalize(Vec2 out, Vec2 a);
VecP Vec2_dot(Vec2 a, Vec2 b);
Vec3 Vec2_cross(Vec3 out, Vec2 a, Vec2 b);
Vec2 Vec2_lerp(Vec2 out, Vec2 a, Vec2 b, VecP t);
Vec2 Vec2_random(Vec2 out, VecP scale);
Vec2 Vec2_transformMat2(Vec2 out, Vec2 a, Mat2 m);
Vec2 Vec2_transformMat2d(Vec2 out, Vec2 a, Mat2d m);
Vec2 Vec2_transformMat3(Vec2 out, Vec2 a, Mat3 m);
Vec2 Vec2_transformMat4(Vec2 out, Vec2 a, Mat4 m);
Vec2 Vec2_rotate(Vec2 out, Vec2 a, Vec2 b, VecP rad);
VecP Vec2_angle(Vec2 a, Vec2 b);
Vec2 Vec2_zero(Vec2 out);
bool Vec2_equals(Vec2 a, Vec2 b);
Vec4 Vec4_create();
Vec4 Vec4_clone(Vec4 v);
VecP Vec4_length(Vec4 a);
Vec4 Vec4_fromValues(VecP x, VecP y, VecP z, VecP w);
Vec4 Vec4_copy(Vec4 out, Vec4 input);
Vec4 Vec4_set(Vec4 out, VecP x, VecP y, VecP z, VecP w);
Vec4 Vec4_add(Vec4 out, Vec4 a, Vec4 b);
Vec4 Vec4_subtract(Vec4 out, Vec4 a, Vec4 b);
Vec4 Vec4_multiply(Vec4 out, Vec4 a, Vec4 b);
Vec4 Vec4_divide(Vec4 out, Vec4 a, Vec4 b);
Vec4 Vec4_ceil(Vec4 out, Vec4 a);
Vec4 Vec4_floor(Vec4 out, Vec4 a);
Vec4 Vec4_min(Vec4 out, Vec4 a, Vec4 b);
Vec4 Vec4_max(Vec4 out, Vec4 a, Vec4 b);
Vec4 Vec4_round(Vec4 out, Vec4 a);
Vec4 Vec4_scale(Vec4 out, Vec4 a, VecP scale);
Vec4 Vec4_scaleAndAdd(Vec4 out, Vec4 a, Vec4 b, VecP scale);
VecP Vec4_distance(Vec4 out, Vec4 a, Vec4 b);
VecP Vec4_squareDistance(Vec4 out, Vec4 a, Vec4 b);
VecP Vec4_squaredLength(Vec4 a);
Vec4 Vec4_negate(Vec4 out, Vec4 a);
Vec4 Vec4_inverse(Vec4 out, Vec4 a);
Vec4 Vec4_normalize(Vec4 out, Vec4 a);
VecP Vec4_dot(Vec4 a, Vec4 b);
Vec4 Vec4_cross(Vec4 out, Vec4 u, Vec4 v, Vec4 w);
Vec4 Vec4_lerp(Vec4 out, Vec4 a, Vec4 b, VecP t);
Vec4 Vec4_random(Vec4 out, VecP scale);
Vec4 Vec4_transformMat4(Vec4 out, Vec4 a, Mat4 m);
Vec4 Vec4_transformQuat(Vec4 out, Vec4 a, Quat q);
Vec4 Vec4_zero(Vec4 out);
bool Vec4_equals(Vec4 a, Vec4 b);
void Vec4_print(Vec4 this);

// Mat2d ------------------------------------------------------------------------------------

Mat2d Mat2d_create();
Mat2d Mat2d_clone(Mat2d a);
Mat2d Mat2d_copy(Mat2d out, Mat2d a);
Mat2d Mat2d_identity(Mat2d out);
Mat2d Mat2d_fromValues(VecP a, VecP b, VecP c, VecP d, VecP tx, VecP ty);
Mat2d Mat2d_set(Mat2d out, VecP a, VecP b, VecP c, VecP d, VecP tx, VecP ty);
Mat2d Mat2d_invert(Mat2d out, Mat2d a);
VecP Mat2d_determinant(Mat2d a);
Mat2d Mat2d_multiply(Mat2d out, Mat2d a, Mat2d b);
Mat2d Mat2d_rotate(Mat2d out, Mat2d a, VecP rad);
Mat2d Mat2d_scale(Mat2d out, Mat2d a, Vec2 v);
Mat2d Mat2d_translate(Mat2d out, Mat2d a, Vec2 v);
Mat2d Mat2d_fromRotation(Mat2d out, VecP rad);
Mat2d Mat2d_fromScaling(Mat2d out, Vec2 v);
Mat2d Mat2d_fromTranslation(Mat2d out, Vec2 v);
VecP Mat2d_frob(Mat2d out, Mat2d a, VecP v);
Mat2d Mat2d_add(Mat2d out, Mat2d a, Vec2 b);
Mat2d Mat2d_substract(Mat2d out, Mat2d a, Vec2 b);
bool Mat2d_equal(Mat2d a, Vec2 b);
Mat2d Mat2d_multiplyScalar(Mat2d out, Mat2d a, VecP b);
Mat2d Mat2d_multiplyScalarAndAdd(Mat2d out, Mat2d a, Mat2d b, VecP scale);
Mat2 Mat2_create();
Mat2 Mat2_clone(Mat2 a);
Mat2 Mat2_copy(Mat2 out, Mat2 a);
Mat2 Mat2_identity(Mat2 out);
Mat2 Mat2_fromValues(VecP m00, VecP m01, VecP m10, VecP m11);
Mat2 Mat2_set(Mat2 out, VecP m00, VecP m01, VecP m10, VecP m11);
Mat2 Mat2_transpose(Mat2 out, Mat2 a);
Mat2 Mat2_invert(Mat2 out, Mat2 a);
Mat2 Mat2_adjoint(Mat2 out, Mat2 a);
VecP Mat2_determinant(Mat2 a);
Mat2 Mat2_multiply(Mat2 out, Mat2 a, Mat2 b);
Mat2 Mat2_rotate(Mat2 out, Mat2 a, VecP rad);
Mat2 Mat2_scale(Mat2 out, Mat2 a, Mat2 v);
Mat2 Mat2_fromRotation(Mat2 out, VecP rad);
Mat2 Mat2_fromScaling(Mat2 out, Vec2 v);
VecP Mat2_frob(Mat2 out, Mat2 a, VecP v);
void Mat2_LDU(Mat2 L, Mat2 D, Mat2 U, Mat2 a);
Mat2 Mat2_add(Mat2 out, Mat2 a, Vec2 b);
Mat2 Mat2_substract(Mat2 out, Mat2 a, Vec2 b);
bool Mat2_equal(Mat2 a, Vec2 b);
Mat2 Mat2_multiplyScalar(Mat2 out, Mat2 a, VecP b);
Mat2 Mat2_multiplyScalarAndAdd(Mat2 out, Mat2 a, Mat2 b, VecP scale);

// Mat3 ------------------------------------------------------------------------------------

Mat3 Mat3_create();
Mat3 Mat3_fromMat4(Mat3 out, Mat4 a);
Mat3 Mat3_clone(Mat3 a);
Mat3 Mat3_copy(Mat3 out, Mat3 a);
Mat3 Mat3_identity(Mat3 out);
Mat3 Mat3_fromValues(VecP m00, VecP m01, VecP m02, VecP m10, VecP m11, VecP m12, VecP m20, VecP m21, VecP m22);
Mat3 Mat3_set(Mat3 out, VecP m00, VecP m01, VecP m02, VecP m10, VecP m11, VecP m12, VecP m20, VecP m21, VecP m22);
Mat3 Mat3_transpose(Mat3 out, Mat3 a);
Mat3 Mat3_invert(Mat3 out, Mat3 a);
Mat3 Mat3_adjoint(Mat3 out, Mat3 a);
VecP Mat3_determinant(Mat3 a);
Mat3 Mat3_multiply(Mat3 out, Mat3 a, Mat3 b);
Mat3 Mat3_translate(Mat3 out, Mat3 a, Vec2 v);
Mat3 Mat3_rotate(Mat3 out, Mat3 a, VecP rad);
Mat3 Mat3_scale(Mat3 out, Mat3 a, Mat3 v);
Mat3 Mat3_fromTranslation(Mat3 out, Vec2 v);
Mat3 Mat3_fromRotation(Mat3 out, VecP rad);
Mat3 Mat3_fromScaling(Mat3 out, Vec2 v);
Mat3 Mat3_fromMat2d(Mat3 out, Mat2d a);
Mat3 Mat3_fromQuat(Mat3 out, Quat q);
Mat3 Mat3_normalFromMat4(Mat3 out, Mat4 a);
Mat3 Mat3_projection(Mat3 out, VecP width, VecP height);
VecP Mat3_frob(Mat3 out, Mat3 a, VecP v);
Mat3 Mat3_add(Mat3 out, Mat3 a, Vec2 b);
Mat3 Mat3_substract(Mat3 out, Mat3 a, Vec2 b);
bool Mat3_equal(Mat3 a, Vec2 b);
Mat3 Mat3_multiplyScalar(Mat3 out, Mat3 a, VecP b);
Mat3 Mat3_multiplyScalarAndAdd(Mat3 out, Mat3 a, Mat3 b, VecP scale);

// Mat4 ------------------------------------------------------------------------------------

Mat4 Mat4_create();
Mat4 Mat4_clone(Mat4 a);
Mat4 Mat4_copy(Mat4 out, Mat4 a);
Mat4 Mat4_identity(Mat4 out);
Mat4 Mat4_fromValues(VecP m00, VecP m01, VecP m02, VecP m03, VecP m10, VecP m11, VecP m12, VecP m13, VecP m20, VecP m21, VecP m22, VecP m23, VecP m30, VecP m31, VecP m32, VecP m33);
Mat4 Mat4_set(Mat4 out, VecP m00, VecP m01, VecP m02, VecP m03, VecP m10, VecP m11, VecP m12, VecP m13, VecP m20, VecP m21, VecP m22, VecP m23, VecP m30, VecP m31, VecP m32, VecP m33);
Mat4 Mat4_transpose(Mat4 out, Mat4 a);
Mat4 Mat4_invert(Mat4 out, Mat4 a);
Mat4 Mat4_adjoint(Mat4 out, Mat4 a);
VecP Mat4_determinant(Mat4 a);
Mat4 Mat4_multiply(Mat4 out, Mat4 a, Mat4 b);
Mat4 Mat4_translate(Mat4 out, Mat4 a, Vec2 v);
Mat4 Mat4_scale(Mat4 out, Mat4 a, Mat4 v);
Mat4 Mat4_rotate(Mat4 out, Mat4 a, VecP rad, Vec3 axis);
Mat4 Mat4_rotateX(Mat4 out, Mat4 a, VecP rad);
Mat4 Mat4_rotateY(Mat4 out, Mat4 a, VecP rad);
Mat4 Mat4_rotateZ(Mat4 out, Mat4 a, VecP rad);
Mat4 Mat4_fromTranslation(Mat4 out, Vec2 v);
Mat4 Mat4_fromScaling(Mat4 out, Vec2 v);
Mat4 Mat4_fromRotation(Mat4 out, VecP rad, Vec3 axis);
Mat4 Mat4_fromXRotation(Mat4 out, VecP rad);
Mat4 Mat4_fromYRotation(Mat4 out, VecP rad);
Mat4 Mat4_fromZRotation(Mat4 out, VecP rad);
Mat4 Mat4_fromRotationTranslation(Mat4 out, Quat q, Vec3 v);
Mat4 Mat4_fromQuat2(Mat4 out, Quat2 a);
Vec3 Mat4_getTranslation(Vec3 out, Mat4 mat);
Vec3 Mat4_getScaling(Vec3 out, Mat4 mat);
Quat Mat4_getRotation(Quat out, Mat4 mat);
Mat4 Mat4_fromRotationTranslationScale(Mat4 out, Quat q, Vec3 v, Vec3 s);
Mat4 Mat4_fromRotationTranslationScaleOrigin(Mat4 out, Quat q, Vec3 v, Vec3 s, Vec3 o);
Mat4 Mat4_fromQuat(Mat4 out, Quat q);
Mat4 Mat4_frustum(Mat4 out, VecP left, VecP right, VecP bottom, VecP top, VecP near, VecP far);
Mat4 Mat4_perspective(Mat4 out, VecP fovy, VecP aspect, VecP near, VecP far);
Mat4 Mat4_perspectiveFromFieldOfView(Mat4 out, struct Fov *fov, VecP near, VecP far);
Mat4 Mat4_ortho(Mat4 out, VecP left, VecP right, VecP bottom, VecP top, VecP near, VecP far);
Mat4 Mat4_lookAt(Mat4 out, Vec3 eye, Vec3 center, Vec3 up);
Mat4 Mat4_targetTo(Mat4 out, Vec3 eye, Vec3 target, Vec3 up);
VecP Mat4_frob(Mat4 out, Mat4 a, VecP v);
Mat4 Mat4_add(Mat4 out, Mat4 a, Mat4 b);
Mat4 Mat4_substract(Mat4 out, Mat4 a, Mat4 b);
Mat4 Mat4_multiplyScalar(Mat4 out, Mat4 a, VecP b);
Mat4 Mat4_multiplyScalarAndAdd(Mat4 out, Mat4 a, Mat4 b, VecP scale);
bool Mat4_equal(Mat4 a, Vec2 b);
void Mat4_print(Mat4 mat);

// Quat ------------------------------------------------------------------------------------

Quat Quat_create();
Quat Quat_fromValues(VecP a, VecP b, VecP c, VecP w);
Quat Quat_copy(Quat out, Quat a);
Quat Quat_clone(Quat a);
Quat Quat_identity(Quat out);
Quat Quat_setAxisAngle(Quat out, Vec3 axis, VecP rad);
VecP Quat_getAxisAngle(Quat out_axis, Quat q);
Quat Quat_multiply(Quat out, Quat a, Quat b);
Quat Quat_rotateX(Quat out, Quat a, VecP rad);
Quat Quat_rotateX(Quat out, Quat a, VecP rad);
Quat Quat_rotateY(Quat out, Quat a, VecP rad);
Quat Quat_rotateY(Quat out, Quat a, VecP rad);
Quat Quat_rotateZ(Quat out, Quat a, VecP rad);
Quat Quat_rotateZ(Quat out, Quat a, VecP rad);
Quat Quat_calculateW(Quat out, Quat a);
Quat Quat_exp(Quat out, Quat a);
Quat Quat_ln(Quat out, Quat a);
Quat Quat_slerp(Quat out, Quat a, Quat b, VecP t);
Quat Quat_random(Quat out);
Quat Quat_invert(Quat out, Quat a);
VecP Quat_squaredLength(Quat a);
Quat Quat_conjugate(Quat out, Quat a);
Quat Quat_fromMat3(Quat out, Mat4 m);
Quat Quat_fromEuler(Quat out, VecP x, VecP y, VecP z);
Quat Quat_scale(Quat out, Quat a, VecP scale);
Quat Quat_add(Quat out, Quat a, Quat b);
VecP Quat_dot(Quat a, Quat b);
Quat Quat_lerp(Quat out, Quat a, Quat b, VecP t);
VecP Quat_length(Quat a);
Quat Quat_normalize(Quat out, Quat a);
bool Quat_equals(Quat a, Quat b);
Quat Quat_rotationTo(Quat out, Vec3 a, Vec3 b);
Quat Quat_sqlerp(Quat out, Quat a, Quat b, Quat c, Quat d, VecP t);
Quat Quat_setAxes(Quat out, Vec3 view, Vec3 right, Vec3 up);
VecP Quat_getAngle(Quat a, Quat b);
Quat Quat_pow(Quat out, Quat a, VecP b);

// Quat2 ------------------------------------------------------------------------------------

Quat2 Quat2_create();
Quat2 Quat2_fromValues(VecP x1, VecP y1, VecP z1, VecP w1, VecP x2, VecP y2, VecP z2, VecP w2);
Quat2 Quat2_fromRotationTranslationValues(VecP x1, VecP y1, VecP z1, VecP w1, VecP x2, VecP y2, VecP z2);
Quat2 Quat2_fromRotationTranslation(Quat2 out, Quat q, Vec3 t);
Quat2 Quat2_fromTranslation(Quat2 out, Vec3 t);
Quat2 Quat2_fromRotation(Quat2 out, Quat q);
Quat2 Quat2_fromMat4(Quat2 out, Mat4 q);
Quat2 Quat2_copy(Quat2 out, Quat2 a);
Quat2 Quat2_clone(Quat2 a);
Quat2 Quat2_identity(Quat2 out);
Quat2 Quat2_set(Quat2 out, VecP x1, VecP y1, VecP z1, VecP w1, VecP x2, VecP y2, VecP z2, VecP w2);
Quat Quat2_getReal(Quat out, Quat2 a);
Quat2 Quat2_setReal(Quat2 out, Quat a);
Quat Quat2_getDual(Quat out, Quat2 a);
Quat Quat2_setDual(Quat out, Quat2 q);
Vec3 Quat2_getTranslation(Vec3 out, Quat2 a);
Quat2 Quat2_translate(Quat2 out, Quat2 a, Vec3 v);
Quat2 Quat2_rotateX(Quat2 out, Quat2 a, VecP rad);
Quat2 Quat2_rotateY(Quat2 out, Quat2 a, VecP rad);
Quat2 Quat2_rotateZ(Quat2 out, Quat2 a, VecP rad);
Quat2 Quat2_rotateByQuatAppend(Quat2 out, Quat2 a, Quat q);
Quat2 Quat2_rotateByQuatPrepend(Quat2 out, Quat2 q, Quat a);
Quat2 Quat2_rotateAroundAxis(Quat2 out, Quat2 a, Vec3 axis, VecP rad);
Quat2 Quat2_add(Quat2 out, Quat2 a, Quat2 b);
Quat2 Quat2_multiply(Quat2 out, Quat2 a, Quat2 b);
Quat2 Quat2_scale(Quat2 out, Quat2 a, VecP b);
VecP Quat2_dot(Quat2 a, Quat2 b);
Quat2 Quat2_lerp(Quat2 out, Quat2 a, Quat2 b, VecP t);
VecP Quat2_squaredLength(Quat2 a);
Quat2 Quat2_invert(Quat2 out, Quat2 a);
Quat2 Quat2_conjugate(Quat2 out, Quat2 a);
VecP Quat2_length(Quat2 a);
Quat2 Quat2_normalize(Quat2 out, Quat2 a);
bool Quat2_equals(Quat2 a, Quat2 b);

void glmatrix_printMat(VecP *mat, size_t cols, size_t rows);

#endif