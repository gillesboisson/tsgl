
#ifndef SCENE_NODE_GEOM
#define SCENE_NODE_GEOM

#include "transform.h"
#include "../core/ptrBuffer.h"

struct NodeQueuePass;

typedef enum
{
  STATIC = 0,
  DYNAMIC = 2,
  CAMERA = 4,
  LIGHT = 8,
} SceneNodeType;

typedef struct SceneNode SceneNode;

struct SceneNode
{
  void (*updateWorldMat)(SceneNode *tr, Mat4 parentMat, bool parentWasDirty);
  SceneNodeType nodeType;
  bool visible;
  bool worldVisible;
  Transform *transform;
  VecP worldMat[16];
  VecP bounds[6];
  PtrBuffer children;
  struct NodeQueuePass *queue;
};

SceneNode *SceneNode_create();
void SceneNode_init(SceneNode *node);
void SceneNode_test(SceneNode *node);
void SceneNode_updateWorldMat(SceneNode *tr, Mat4 parentMat, bool parentWasDirty);

// delegate method
void _SceneNode_updateWorldMat(SceneNode *tr, Mat4 parentMat, bool parentWasDirty);
void SceneNode_setVisible(SceneNode *this, bool visible);

#endif
