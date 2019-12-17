#ifndef SCENE_NODE_RESULT_GEOM
#define SCENE_NODE_RESULT_GEOM

#include "sceneNode.h"
#include "camera.h"
#include "string.h"

typedef struct
{
  VecP mvp[16];
  VecP mv[16];
  VecP rotation[16];
} SceneNodeResult;

inline void SceneNodeResult_compute(SceneNodeResult *out, Camera *camera, SceneNode *node)
{
  SceneNode_updateWorldMat(node, NULL, false);
  memcpy(&out->rotation, node->transform->rotMat, 16 * sizeof(VecP));
  Camera_mvp(camera, out->mvp, node->worldMat);

  //Camera_mv(camera, out->mv, node->worldMat);
}

#endif