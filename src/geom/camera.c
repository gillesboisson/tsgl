#include <math.h>
#include <stdlib.h>
#include <stdbool.h>
#include "camera.h"

#include <emscripten.h>

void _Camera_updateWorldMat(SceneNode *tr, Mat4 parentMat, bool parentWasDirty)
{

  Camera *cam = (Camera *)tr;
  VecP mat[16];

  _SceneNode_updateWorldMat(tr, parentMat, parentWasDirty);
  Mat4_multiply(mat, cam->projectionMat, cam->node.worldMat);
  Frustrum_setFromMat(&cam->frustrum, mat);
}

EMSCRIPTEN_KEEPALIVE void Camera_initUpdateWorldMatMethod(Camera *this)
{
  this->node.updateWorldMat = &_Camera_updateWorldMat;
}
