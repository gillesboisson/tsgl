
#ifndef SCENE_NODE_GEOM
#define SCENE_NODE_GEOM

#include "transform.h"
#include "../core/ptrBuffer.h"

typedef enum
{
  STATIC = 0,
  DYNAMIC = 2,
  CAMERA = 4,
  LIGHT = 8,
} SceneNodeType;

typedef struct
{
  SceneNodeType nodeType;
  Transform *transform;
  VecP worldMat[16];
  VecP bounds[6];
  PtrBuffer children;

} SceneNode;

SceneNode *SceneNode_create();
void SceneNode_init(SceneNode *node);
void SceneNode_test(SceneNode *node);
void SceneNode_updateWorldMat(SceneNode *tr, Mat4 parentMat, bool parentWasDirty);

#endif
