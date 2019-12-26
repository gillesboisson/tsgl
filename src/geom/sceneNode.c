
#include "geom.h"
#include "sceneNode.h"
#include "transform.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>
#include <stdio.h>
#include <emscripten.h>

SceneNode *SceneNode_create()
{
  SceneNode *node = malloc(sizeof(SceneNode));
  SceneNode_init(node);
  return node;
}

void SceneNode_init(SceneNode *node)
{
  node->transform = Transform_create();
}

EMSCRIPTEN_KEEPALIVE void SceneNode_test(SceneNode *node)
{

  for (size_t i = 0; i < node->children.length; i++)
  {
    SceneNode_test(node->children.buffer[i]);
  }
}

EMSCRIPTEN_KEEPALIVE void SceneNode_updateWorldMat(SceneNode *tr, Mat4 parentMat, bool parentWasDirty)
{
  bool dirty = DIRTY_GLOBAL & tr->transform->dirty | parentWasDirty;

  if (dirty)
  {
    if (tr->transform->dirty & DIRTY_LOCAL)
      Transform_updateLocalMat(tr->transform);

    if (parentMat != NULL)
    {
      Mat4_multiply(tr->worldMat, parentMat, tr->transform->localMat);
    }
    else
    {
      Mat4_copy(tr->worldMat, tr->transform->localMat);
    }

    if (tr->nodeType == CAMERA)
    {
      Mat4_invert(tr->worldMat, tr->worldMat);
    }

    tr->transform->dirty = tr->transform->dirty & ~(DIRTY_GLOBAL | DIRTY_LOCAL);
  }

  for (size_t i = 0; i < tr->children.length; i++)
  {
    SceneNode_updateWorldMat((SceneNode *)tr->children.buffer[i], tr->worldMat, dirty);
  }
}
