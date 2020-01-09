
#include <math.h>
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <emscripten/emscripten.h>

#include "transform.h"
#include "../core/wasmBuffer.h"
#include "../core/helpers.h"

Mat4 TranslateScaleRotateQuat(Mat4 out, Vec3 scale, Quat rotQuat, Vec3 position, Mat4 rotMat)
{
  Mat4_translate(out, (Mat4)IDENT_MAT4, position);
  Mat4_scale(out, out, scale);
  Mat4_fromQuat(rotMat, rotQuat);
  Mat4_multiply(out, out, rotMat);
  return out;
}

Transform *Transform_create()
{
  Transform *out = malloc(sizeof(Transform));
  Transform_init(out);
  return out;
}

void Transform_init(Transform *transform)
{
  transform->dirty = DIRTY_NONE;
  Vec3_set(transform->position, 0, 0, 0);
  Vec3_set(transform->scale, 1, 1, 1);
  Quat_identity(transform->rotation);
  Mat4_identity(transform->localMat);
  Mat4_identity(transform->rotMat);
  // Mat4_identity(transform->worldMat);
  // PtrBuffer_init(&transform->children);
}

void Transform_setPosition(Transform *tr, VecP x, VecP y, VecP z)
{
  Vec3_set(tr->position, x, y, z);
  tr->dirty = tr->dirty | DIRTY_LOCAL;
}

void Transform_setScale(Transform *tr, VecP x, VecP y, VecP z)
{
  Vec3_set(tr->scale, x, y, z);
  tr->dirty = tr->dirty | DIRTY_LOCAL;
}

void Transform_translate(Transform *tr, VecP x, VecP y, VecP z)
{
  tr->position[0] += x;
  tr->position[1] += y;
  tr->position[2] += z;
  tr->dirty = tr->dirty | DIRTY_LOCAL;
}

void Transform_setRotationEuler(Transform *tr, VecP x, VecP y, VecP z)
{
  Quat_fromEuler(tr->rotation, x, y, z);
  tr->dirty = tr->dirty | DIRTY_LOCAL;
}

void Transform_rotateEuler(Transform *tr, VecP x, VecP y, VecP z)
{
  Quat_rotateX(tr->rotation, tr->rotation, x);
  Quat_rotateY(tr->rotation, tr->rotation, y);
  Quat_rotateZ(tr->rotation, tr->rotation, z);
  tr->dirty = tr->dirty | DIRTY_LOCAL;
}

void Transform_rotateAroundAxes(Transform *tr, Vec3 axe, VecP angle)
{
  VecP quat[4];
  Quat_setAxisAngle(quat, axe, angle);
  Quat_multiply(tr->rotation, tr->rotation, quat);
  tr->dirty = tr->dirty | DIRTY_LOCAL;
}

void Transform_setEulerRotation(Transform *tr, VecP x, VecP y, VecP z)
{
  Quat_fromEuler(tr->rotation, x, y, z);
  tr->dirty = tr->dirty | DIRTY_LOCAL;
}

void Transform_updateLocalMat(Transform *tr)
{
  TranslateScaleRotateQuat(tr->localMat, tr->scale, tr->rotation, tr->position, tr->rotMat);
  tr->dirty = tr->dirty & ~DIRTY_LOCAL;
}

void Transform_updateLocalMat_Cam(Transform *tr)
{
  VecP nPos[3];
  Vec3_negate((Vec3)&nPos, tr->position);
  TranslateScaleRotateQuat(tr->localMat, tr->scale, tr->rotation, (Vec3)&nPos, tr->rotMat);
  tr->dirty = tr->dirty & ~DIRTY_LOCAL;
}

Mat4 Transform_getLocalMat(Transform *tr)
{
  if (tr->dirty & DIRTY_LOCAL)
    Transform_updateLocalMat(tr);
  return tr->localMat;
}

TransformUpdateLocalMethod *Transform_getMethods()
{
  TransformUpdateLocalMethod *res = malloc(2 * sizeof(TransformUpdateLocalMethod));
  res[0] = &Transform_updateLocalMat;
  res[1] = &Transform_updateLocalMat_Cam;
  return res;
}

/*
void Transform_addChild(Transform* tr, Transform* child){
    PtrBuffer_push(&tr->children, child);
}

void Transform_removeChild(Transform* tr, Transform* child){
    PtrBuffer_remove(&tr->children, child, true);
}
*/

/*
EMSCRIPTEN_KEEPALIVE void Transform_updateWorldMat(Transform *tr, Mat4 parentMat, bool parentWasDirty)
{
  bool dirty = DIRTY_GLOBAL & tr->dirty | parentWasDirty;

  if (dirty)
  {
    if (tr->dirty & DIRTY_LOCAL)
      Transform_updateLocalMat(tr);

    if (parentMat != NULL)
    {
      Mat4_multiply(tr->worldMat, parentMat, tr->localMat);
    }
    else
    {
      Mat4_copy(tr->worldMat, tr->localMat);
    }
    tr->dirty = tr->dirty & ~(DIRTY_GLOBAL | DIRTY_LOCAL);
  }

  for (size_t i = 0; i < tr->children.length; i++)
  {
    Transform_updateWorldMat((Transform *)tr->children.buffer[i], tr->worldMat, dirty);
  }
}
*/

EMSCRIPTEN_KEEPALIVE void Transform_print(Transform *tr, bool debugChildren)
{
  WasmBuffer *B = malloc(sizeof(WasmBuffer));
  size_t ind = 0;
  WasmBuffer_next(B, &ind);

  printf("Dirty %i\n", tr->dirty);
  printf("Position %f %f %f \n", tr->position[0], tr->position[1], tr->position[2]);
  printf("Scale %f %f %f \n", tr->scale[0], tr->scale[1], tr->scale[2]);
  printf("Rotation %f %f %f %f \n", tr->rotation[0], tr->rotation[1], tr->rotation[2], tr->rotation[3]);
  printf(
      "localMat\n\t %f %f %f %f\n\t %f %f %f %f\n\t %f %f %f %f\n\t %f %f %f %f\n",
      tr->localMat[0], tr->localMat[1], tr->localMat[2], tr->localMat[3],
      tr->localMat[4], tr->localMat[5], tr->localMat[6], tr->localMat[7],
      tr->localMat[8], tr->localMat[9], tr->localMat[10], tr->localMat[11],
      tr->localMat[12], tr->localMat[13], tr->localMat[14], tr->localMat[15]);
  // printf(
  //     "worldMat\n\t %f %f %f %f\n\t %f %f %f %f\n\t %f %f %f %f\n\t %f %f %f %f\n",
  //     tr->worldMat[0], tr->worldMat[1], tr->worldMat[2], tr->worldMat[3],
  //     tr->worldMat[4], tr->worldMat[5], tr->worldMat[6], tr->worldMat[7],
  //     tr->worldMat[8], tr->worldMat[9], tr->worldMat[10], tr->worldMat[11],
  //     tr->worldMat[12], tr->worldMat[13], tr->worldMat[14], tr->worldMat[15]);
  printf(
      "rotMat\n\t %f %f %f %f\n\t %f %f %f %f\n\t %f %f %f %f\n\t %f %f %f %f\n",
      tr->rotMat[0], tr->rotMat[1], tr->rotMat[2], tr->rotMat[3],
      tr->rotMat[4], tr->rotMat[5], tr->rotMat[6], tr->rotMat[7],
      tr->rotMat[8], tr->rotMat[9], tr->rotMat[10], tr->rotMat[11],
      tr->rotMat[12], tr->rotMat[13], tr->rotMat[14], tr->rotMat[15]);

  printf("Children\n");
  // PtrBuffer_print(&tr->children);

  /*
  if (debugChildren)
  {
    for (size_t i = 0; i < tr->children.length; i++)
    {
      printf("Debug %p\n", tr->children.buffer[i]);
      Transform_print(tr->children.buffer[i], true);
    }
  }
  */
}