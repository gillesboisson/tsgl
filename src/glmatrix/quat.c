#include "./glmatrix.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>

Quat Quat_create() {
  Quat out = malloc(sizeof(VecP) * 4);
  
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  out[3] = 1;
  return out;
}

Quat Quat_fromValues(VecP a,VecP b,VecP c,VecP w){
  Quat out = malloc(sizeof(VecP) * 4);
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = w;

  return out;
}

Quat Quat_copy(Quat out, Quat a){
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}


Quat Quat_clone(Quat a){
  Quat out = malloc(sizeof(VecP) * 4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}



Quat Quat_identity(Quat out) {
  
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

Quat Quat_setAxisAngle(Quat out, Vec3 axis, VecP rad) {
  rad = rad * 0.5;
  VecP s = sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = cos(rad);
  return out;
}

VecP Quat_getAxisAngle(Quat out_axis, Quat q) {
  VecP rad = acos(q[3]) * 2.0;
  VecP s = sin(rad / 2.0);
  if (s > 0) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }
  return rad;
}


Quat Quat_multiply(Quat out,Quat a,Quat b) {
  VecP ax = a[0], ay = a[1], az = a[2], aw = a[3];
  VecP bx = b[0], by = b[1], bz = b[2], bw = b[3];

  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}

Quat Quat_rotateX(Quat out,Quat  a,VecP rad) {
  rad *= 0.5;

  VecP ax = a[0], ay = a[1], az = a[2], aw = a[3];
  VecP bx = sin(rad), bw = cos(rad);

  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}


Quat Quat_rotateY(Quat out,Quat a,VecP rad) {
  rad *= 0.5;

  VecP ax = a[0], ay = a[1], az = a[2], aw = a[3];
  VecP by = sin(rad), bw = cos(rad);

  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}


Quat Quat_rotateZ(Quat out,Quat a,VecP rad) {
  rad *= 0.5;

  VecP ax = a[0], ay = a[1], az = a[2], aw = a[3];
  VecP bz = sin(rad), bw = cos(rad);

  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}

Quat Quat_calculateW(Quat out,Quat a) {
  VecP x = a[0], y = a[1], z = a[2];

  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = sqrt(abs((int)(1.0 - x * x - y * y - z * z)));
  return out;
}

Quat Quat_exp(Quat out,Quat a) {
  VecP x = a[0], y = a[1], z = a[2], w = a[3];

  VecP r = sqrt(x*x + y*y + z*z);
  VecP et = exp(w);
  VecP s = r > 0 ? et * sin(r) / r : 0;

  out[0] = x * s;
  out[1] = y * s;
  out[2] = z * s;
  out[3] = et * cos(r);

  return out;
}

Quat Quat_ln(Quat out,Quat a) {
  VecP x = a[0], y = a[1], z = a[2], w = a[3];

  VecP r = sqrt(x*x + y*y + z*z);
  VecP t = r > 0 ? atan2(r, w) / r : 0;

  out[0] = x * t;
  out[1] = y * t;
  out[2] = z * t;
  out[3] = 0.5 * log(x*x + y*y + z*z + w*w);

  return out;
}




Quat Quat_slerp(Quat out,Quat  a,Quat  b,VecP t) {
  VecP ax = a[0], ay = a[1], az = a[2], aw = a[3];
  VecP bx = b[0], by = b[1], bz = b[2], bw = b[3];

  VecP omega, cosom, sinom, scale0, scale1;

  // calc cosine
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  // adjust signs (if necessary)
  if ( cosom < 0.0 ) {
    cosom = -cosom;
    bx = - bx;
    by = - by;
    bz = - bz;
    bw = - bw;
  }
  // calculate coefficients
  if ( (1.0 - cosom) > 0 ) {
    // standard case (slerp)
    omega  = acos(cosom);
    sinom  = sin(omega);
    scale0 = sin((1.0 - t) * omega) / sinom;
    scale1 = sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  }
  // calculate final values
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

Quat Quat_random(Quat out) {
  // Implementation of http://planning.cs.uiuc.edu/node198.html
  // TODO: Calling random 3 times is probably not the fastest solution
  VecP u1 = random();
  VecP u2 = random();
  VecP u3 = random();

  VecP sqrt1MinusU1 = sqrt(1 - u1);
  VecP sqrtU1 = sqrt(u1);

  out[0] = sqrt1MinusU1 * sin(2.0 * M_PI * u2);
  out[1] = sqrt1MinusU1 * cos(2.0 * M_PI * u2);
  out[2] = sqrtU1 * sin(2.0 * M_PI * u3);
  out[3] = sqrtU1 * cos(2.0 * M_PI * u3);
  return out;
}

Quat Quat_invert(Quat out,Quat a) {
  VecP a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  VecP dot = a0*a0 + a1*a1 + a2*a2 + a3*a3;
  VecP invDot = dot ? 1.0/dot : 0;

  // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0*invDot;
  out[1] = -a1*invDot;
  out[2] = -a2*invDot;
  out[3] = a3*invDot;
  return out;
}

VecP Quat_squaredLength(Quat a) {
  VecP x = a[0];
  VecP y = a[1];
  VecP z = a[2];
  VecP w = a[3];
  return x*x + y*y + z*z + w*w;
}

Quat Quat_conjugate(Quat out,Quat a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}

Quat Quat_fromMat3(Quat out,Mat4 m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  VecP fTrace = m[0] + m[4] + m[8];
  VecP fRoot;

  if ( fTrace > 0.0 ) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = sqrt(fTrace + 1.0);  // 2w
    out[3] = 0.5 * fRoot;
    fRoot = 0.5/fRoot;  // 1/(4w)
    out[0] = (m[5]-m[7])*fRoot;
    out[1] = (m[6]-m[2])*fRoot;
    out[2] = (m[1]-m[3])*fRoot;
  } else {
    // |w| <= 1/2
    int i = 0;
    if ( m[4] > m[0] )
      i = 1;
    if ( m[8] > m[i*3+i] )
      i = 2;
    int j = (i+1)%3;
    int k = (i+2)%3;

    fRoot = sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
    out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
    out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
  }

  return out;
}

Quat Quat_fromEuler(Quat out,VecP x,VecP  y,VecP z) {
    x *= 0.5;
    y *= 0.5;
    z *= 0.5;

    VecP sx = sin(x);
    VecP cx = cos(x);
    VecP sy = sin(y);
    VecP cy = cos(y);
    VecP sz = sin(z);
    VecP cz = cos(z);

    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;

    return out;
}

Quat Quat_scale(Quat out, Quat a, VecP scale){
    out[0] = a[0] * scale;
    out[1] = a[1] * scale;
    out[2] = a[2] * scale;
    out[3] = a[3] * scale;
    return out;
}

Quat Quat_add(Quat out, Quat a, Quat b){
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
}


VecP Quat_dot(Quat a, Quat b){
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]+ a[3] * b[3];
}


Quat Quat_lerp(Quat out,Quat a,Quat b,VecP t) {
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


VecP Quat_length(Quat a){
    return sqrt((a[0]*a[0] + a[1]*a[1] + a[2]*a[2] + a[3]*a[3]));
}



Quat Quat_normalize(Quat out, Quat a) {
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


bool Quat_equals(Quat a, Quat b){
    return a[0] == b[0] && a[1] == b[1] && a[2] == b[2];
}


VecP __tmpvec3[] = {0,0,0};
VecP __xUnitVec3[] = {1,0,0};
VecP __yUnitVec3[] = {0,1,0};

Quat Quat_rotationTo(Quat out,Vec3 a,Vec3 b) {
    VecP dot = Vec3_dot(a, b);
    if (dot < -0.999999) {
      Vec3_cross(__tmpvec3, __xUnitVec3, a);
      if (Vec3_length(__tmpvec3) < 0.000001)
        Vec3_cross(__tmpvec3, __yUnitVec3, a);
      Vec3_normalize(__tmpvec3, __tmpvec3);
      Quat_setAxisAngle(out, __tmpvec3, M_PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      Vec3_cross(__tmpvec3, a, b);
      out[0] = __tmpvec3[0];
      out[1] = __tmpvec3[1];
      out[2] = __tmpvec3[2];
      out[3] = 1 + dot;
      return Quat_normalize(out, out);
    }
  };

VecP __quattemp1[] = {0,0,0,1};
VecP __quattemp2[] = {0,0,0,1};

Quat Quat_sqlerp(Quat out,Quat  a,Quat  b,Quat  c,Quat  d,VecP t) {
  Quat_slerp(__quattemp1, a, d, t);
  Quat_slerp(__quattemp2, b, c, t);
  Quat_slerp(out, __quattemp1, __quattemp2, 2 * t * (1 - t));

  return out;
};

VecP matr[9];

Quat Quat_setAxes(Quat out,Vec3 view,Vec3  right,Vec3  up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];

    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];

    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];

    return Quat_normalize(out, Quat_fromMat3(out, matr));
  };


VecP Quat_getAngle(Quat a, Quat b) {
  VecP dotproduct = Quat_dot(a, b);
  
  return acos(2 * dotproduct*dotproduct - 1);
}

Quat Quat_pow(Quat out,Quat a, VecP b) {
  Quat_ln(out, a);
  Quat_scale(out, out, b);
  Quat_exp(out, out);
  return out;
}