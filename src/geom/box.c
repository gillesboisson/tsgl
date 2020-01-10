#include "box.h"
#include <math.h>
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <emscripten.h>

Box Box_create()
{
  Box out = malloc(sizeof(VecP) * 6);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 0;

  return out;
}

Box Box_set(Box out, VecP minX, VecP maxX, VecP minY, VecP maxY, VecP minZ, VecP maxZ)
{
  out[0] = minX;
  out[1] = maxX;
  out[2] = minY;
  out[3] = maxY;
  out[4] = minZ;
  out[5] = maxZ;

  return out;
}

Box Box_setPosSize(Box out, VecP x, VecP y, VecP z, VecP width, VecP height, VecP depth)
{
  out[0] = x;
  out[1] = x + width;
  out[2] = y;
  out[3] = y + height;
  out[4] = z;
  out[5] = z + depth;

  return out;
}

Box Box_copy(Box out, Box source)
{
  out[0] = source[0];
  out[1] = source[1];
  out[2] = source[2];
  out[3] = source[3];
  out[4] = source[4];
  out[5] = source[5];
  return out;
}

Box Box_fromValues(VecP minX, VecP maxX, VecP minY, VecP maxY, VecP minZ, VecP maxZ)
{
  Box out = malloc(sizeof(VecP) * 6);

  out[0] = minX;
  out[1] = maxX;
  out[2] = minY;
  out[3] = maxY;
  out[4] = minZ;
  out[5] = maxZ;

  return out;
}

Box Box_toVertices(Box out, Box source)
{

  out[0] = source[0];
  out[1] = source[2];
  out[2] = source[4];

  out[3] = source[1];
  out[4] = source[2];
  out[5] = source[4];

  out[6] = source[1];
  out[7] = source[3];
  out[8] = source[4];

  out[9] = source[0];
  out[10] = source[3];
  out[11] = source[4];

  out[12] = source[0];
  out[13] = source[2];
  out[14] = source[5];

  out[15] = source[1];
  out[16] = source[2];
  out[17] = source[5];

  out[18] = source[1];
  out[19] = source[3];
  out[20] = source[5];

  out[21] = source[0];
  out[22] = source[3];
  out[23] = source[5];

  return out;
}

void Box_updateScalePos(Vec3 outPos, Vec3 outScale, Box source)
{
  outScale[0] = source[1] - source[0];
  outScale[1] = source[2] - source[3];
  outScale[2] = source[4] - source[5];

  outPos[0] = source[0] + outScale[0] / 2;
  outPos[1] = source[2] - outScale[1] / 2;
  outPos[2] = source[4] - outScale[2] / 2;
}

Box Box_applyMat(Box out, Box source, Mat4 mat)
{
  VecP _b_v[3];
  VecP _b_temp[24];
  VecP _b_points[24];

  Box_toVertices(_b_points, source);
  for (int i = 0; i < 8; i++)
  {
    Vec3_transformMat4(&_b_points[i * 3], &_b_points[i * 3], mat);
  }
  Box_setFromPoints(out, _b_points, 24, NULL);

  return out;
}

Box Box_clone(Box source)
{
  Box out = malloc(sizeof(VecP) * 6);

  out[0] = source[0];
  out[1] = source[1];
  out[2] = source[2];
  out[3] = source[3];
  out[4] = source[4];
  out[5] = source[5];

  return out;
}

Box Box_clean(Box out)
{
  VecP tvp;
  if (out[0] > out[1])
  {
    tvp = out[0];
    out[0] = out[1];
    out[1] = tvp;
  }

  if (out[2] > out[3])
  {
    tvp = out[2];
    out[2] = out[3];
    out[3] = tvp;
  }

  if (out[4] > out[5])
  {
    tvp = out[4];
    out[4] = out[5];
    out[5] = tvp;
  }

  return out;
}

Box Box_fromVecs(Vec3 min, Vec3 max)
{
  Box out = malloc(sizeof(VecP) * 6);
  out[0] = min[0];
  out[1] = max[0];
  out[2] = min[1];
  out[3] = max[1];
  out[4] = min[2];
  out[5] = min[2];
  return Box_clean(out);
}

Box Box_fromCenterSize(Vec3 centerVec, Vec3 sizeVec)
{
  Box out = malloc(sizeof(VecP) * 6);

  out[0] = centerVec[0] - sizeVec[0] / 2;
  out[1] = centerVec[0] + sizeVec[0] / 2;
  out[2] = centerVec[1] - sizeVec[1] / 2;
  out[3] = centerVec[1] + sizeVec[1] / 2;
  out[4] = centerVec[2] - sizeVec[2] / 2;
  out[5] = centerVec[2] + sizeVec[2] / 2;

  return out;
}

Box Box_setCenterSize(Box out, Vec3 centerVec, Vec3 sizeVec)
{
  out[0] = centerVec[0] - sizeVec[0] / 2;
  out[1] = centerVec[0] + sizeVec[0] / 2;
  out[2] = centerVec[1] - sizeVec[1] / 2;
  out[3] = centerVec[1] + sizeVec[1] / 2;
  out[4] = centerVec[2] - sizeVec[2] / 2;
  out[5] = centerVec[2] + sizeVec[2] / 2;

  return out;
};
Vec3 Box_copyCenter(Vec3 outVec, Box source)
{
  outVec[0] = source[0] + (source[1] - source[0]) / 2;
  outVec[1] = source[2] + (source[3] - source[2]) / 2;
  outVec[2] = source[4] + (source[5] - source[4]) / 2;
  return outVec;
}

Box Box_copySize(Vec3 outVec, Box source)
{
  outVec[0] = source[1] - source[0];
  outVec[1] = source[3] - source[2];
  outVec[2] = source[5] - source[4];
  return outVec;
}

bool Box_containsVec(Box box, Vec3 vec)
{

  return !(vec[0] < box[0] || vec[0] > box[1] ||
           vec[1] < box[2] || vec[1] > box[3] ||
           vec[2] < box[4] || vec[2] > box[5]);
}

void Box_reset(Box out)
{
  out[0] = out[1] = out[2] = out[3] = out[4] = out[5] = 0;
}

EMSCRIPTEN_KEEPALIVE Box Box_setFromVertices(Box out, VecP *vertices, size_t nbVertices, size_t stride, size_t offset, Mat4 mat)
{
  if (nbVertices == 0)
    return out;

  int verticesByteLength = nbVertices * stride;
  VecP tVect[3];

  void *ptr0 = (void *)vertices + offset;
  void *ptrMax = ptr0 + stride * nbVertices;

  // debugger;

  bool applyMat = mat != NULL;

  for (void *ptr = ptr0; ptr < ptrMax; ptr += stride)
  {
    VecP *vertex = ptr;

    if (applyMat)
      Vec3_transformMat4(tVect, tVect, mat);

    if (ptr == ptr0)
    {
      out[0] = out[1] = vertex[0];
      out[2] = out[3] = vertex[1];
      out[4] = out[5] = vertex[2];
    }
    else
    {
      if (vertex[0] < out[0])
        out[0] = vertex[0];

      if (vertex[0] > out[1])
        out[1] = vertex[0];

      if (vertex[1] < out[2])
        out[2] = vertex[1];

      if (vertex[1] > out[3])
        out[3] = vertex[1];

      if (vertex[2] < out[4])
        out[4] = vertex[2];

      if (vertex[2] > out[5])
        out[5] = vertex[2];
    }
  }

  return out;
}

Box Box_setFromPoints(Box out, VecP *vertices, int nbPoints, Mat4 mat)
{

  if (nbPoints == 0)
    return out;
  VecP tVect[3];

  int verticesLength = nbPoints * 3;

  // debugger;

  bool applyMat = mat != NULL;

  for (int i = 0; i < verticesLength; i += 3)
  {
    tVect[0] = vertices[i];
    tVect[1] = vertices[i + 1];
    tVect[2] = vertices[i + 2];

    if (applyMat)
      Vec3_transformMat4(tVect, tVect, mat);

    if (i == 0)
    {
      out[0] = out[1] = tVect[0];
      out[2] = out[3] = tVect[1];
      out[4] = out[5] = tVect[2];
    }
    else
    {
      if (tVect[0] < out[0])
        out[0] = tVect[0];

      if (tVect[0] > out[1])
        out[1] = tVect[0];

      if (tVect[1] < out[2])
        out[2] = tVect[1];

      if (tVect[1] > out[3])
        out[3] = tVect[1];

      if (tVect[2] < out[4])
        out[4] = tVect[2];

      if (tVect[2] > out[5])
        out[5] = tVect[2];
    }
  }

  return out;
}

Box Box_addMargin(Box out, VecP marginX, VecP marginY, VecP marginZ)
{

  out[0] -= marginX;
  out[1] += marginX;

  out[2] -= marginY;
  out[3] += marginY;

  out[4] -= marginZ;
  out[5] += marginZ;
  return out;
}

bool Box_contains(Box box1, Box box2)
{

  return box1[0] <= box2[0] && box1[1] >= box2[1] &&
         box1[2] <= box2[2] && box1[3] >= box2[3] &&
         box1[4] <= box2[4] && box1[5] >= box2[5];
}

bool Box_interesects(Box box1, Box box2)
{

  return !(
      box2[1] < box1[0] || box2[0] > box1[1] ||
      box2[3] < box1[2] || box2[2] > box1[3] ||
      box2[5] < box1[4] || box2[4] > box1[5]);
}

bool Box_interesectsIn(Box box1, Box box2)
{

  return !(
      box2[1] <= box1[0] || box2[0] >= box1[1] ||
      box2[3] <= box1[2] || box2[2] >= box1[3] ||
      box2[5] <= box1[4] || box2[4] >= box1[5]);
}

Box Box_setIntersection(Box out, Box box1, Box box2)
{
  VecP x0 = box1[0] > box2[0] ? box1[0] : box2[0];
  VecP y0 = box1[2] > box2[2] ? box1[2] : box2[2];
  VecP z0 = box1[4] > box2[4] ? box1[4] : box2[4];

  VecP x1 = box1[1] < box2[1] ? box1[1] : box2[1];
  VecP y1 = box1[3] < box2[3] ? box1[3] : box2[3];
  VecP z1 = box1[5] < box2[5] ? box1[5] : box2[5];

  out[0] = x0;
  out[1] = x1;
  out[2] = y0;
  out[3] = y1;
  out[4] = z0;
  out[5] = z1;
  return out;
}

Box Box_merge(Box out, Box box1, Box box2)
{
  VecP x0 = box1[0] < box2[0] ? box1[0] : box2[0];
  VecP y0 = box1[2] < box2[2] ? box1[2] : box2[2];
  VecP z0 = box1[4] < box2[4] ? box1[4] : box2[4];

  VecP x1 = box1[1] > box2[1] ? box1[1] : box2[1];
  VecP y1 = box1[3] > box2[3] ? box1[3] : box2[3];
  VecP z1 = box1[5] > box2[5] ? box1[5] : box2[5];

  out[0] = x0;
  out[1] = x1;
  out[2] = y0;
  out[3] = y1;
  out[4] = z0;
  out[5] = z1;
  return out;
}

Box Box_move(Box out, Vec3 v)
{
  out[0] += v[0];
  out[1] += v[0];
  out[2] += v[1];
  out[3] += v[1];
  out[4] += v[2];
  out[5] += v[2];

  return out;
}

Box Box_setSize(Box out, VecP width, VecP height, VecP depth)
{
  out[1] = out[0] + width;
  out[3] = out[2] + height;
  out[5] = out[4] + depth;
  return out;
}

Box Box_setSizeFromVec3(Box out, Vec3 vec)
{
  return Box_setSize(out, vec[0], vec[1], vec[2]);
}
Box Box_expand(Box out, VecP x, VecP y, VecP z)
{
  out[0] -= x;
  out[1] += x;
  out[2] -= y;
  out[3] += y;
  out[4] -= z;
  out[5] += z;

  return out;
}

bool Box_intersectPlane(Box source, Plane sPlane)
{
  // We compute the minimum and maximum dot product values. If those values
  // are on the same side (back or front) of the plane, then there is no intersection.

  VecP min, max;

  if (sPlane[0] > 0)
  {

    min = sPlane[0] * source[0];
    max = sPlane[0] * source[1];
  }
  else
  {

    min = sPlane[0] * source[1];
    max = sPlane[0] * source[0];
  }

  if (sPlane[1] > 0)
  {

    min += sPlane[1] * source[2];
    max += sPlane[1] * source[3];
  }
  else
  {

    min += sPlane[1] * source[3];
    max += sPlane[1] * source[2];
  }

  if (sPlane[2] > 0)
  {

    min += sPlane[2] * source[4];
    max += sPlane[2] * source[5];
  }
  else
  {

    min += sPlane[2] * source[5];
    max += sPlane[2] * source[4];
  }

  return (min <= sPlane[3] && max >= sPlane[3]);
}

void Box_print(Box source)
{
  printf("Box | min %f %f %F | max %f %f %f\n", source[0], source[2], source[4], source[1], source[3], source[5]);
}

void Box_getSize(Vec3 out, Box box)
{
  out[0] = box[1] - box[0];
  out[1] = box[3] - box[2];
  out[2] = box[5] - box[3];
}
