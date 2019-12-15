
#ifndef SCENE_NODE_GEOM
#define SCENE_NODE_GEOM

#include "transform.h"
#include "../core/ptrBuffer.h"

typedef enum
{
  Static = 0,
  Dynamic = 2,
  Camera = 4,
  Light = 8,
} SceneNodeType;

typedef struct
{
  SceneNodeType nodeType;
  Transform *transform;
  VecP worldMat[16];
  VecP bounds[6];
  PtrBuffer children;

} SceneNode;

void SceneNode_test(SceneNode *node);

#endif
