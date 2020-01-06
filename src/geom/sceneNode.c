
#include "sceneNode.h"
#include "geom.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>
#include <stdio.h>
#include <emscripten.h>

void _SceneNode_updateWorldMat(SceneNode *tr, Mat4 parentMat, bool parentWasDirty)
{
  // printf("> _SceneNode_updateWorldMat\n");
  if (!tr->visible)
    return;
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

//  ------------------------------------------------------------------------------------

SceneNode *SceneNode_create()
{
  SceneNode *node = malloc(sizeof(SceneNode));
  SceneNode_init(node);
  return node;
}

EMSCRIPTEN_KEEPALIVE void SceneNode_initUpdateWorldMatMethod(SceneNode *this)
{
  this->updateWorldMat = &_SceneNode_updateWorldMat;
}

void SceneNode_init(SceneNode *node)
{
  SceneNode_initUpdateWorldMatMethod(node);
  node->transform = Transform_create();
  node->visible = true;
  node->worldVisible = true;
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
  return (*tr->updateWorldMat)(tr, parentMat, parentWasDirty);
}

EMSCRIPTEN_KEEPALIVE void SceneNode_updateChildrenWorldVisible(SceneNode *this)
{
  for (size_t i = 0; i < this->children.length; i++)
  {
    SceneNode *child = (SceneNode *)(this->children.buffer[i]);
    child->worldVisible = this->worldVisible && child->visible;
    SceneNode_updateChildrenWorldVisible(child);
  }
}

void SceneNode_setVisible(SceneNode *this, bool visible)
{
  if (visible != this->visible)
  {
    this->visible = visible;
    this->worldVisible = visible;
    SceneNode_updateChildrenWorldVisible(this);
  }
}