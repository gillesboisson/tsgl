#include <math.h>
#include <stdio.h>
#include <emscripten.h>
#include "../geom/geom.h"
#include "../geom/sceneNode.h"
#include "nodeQueuePass.h"

void *ANodeQueuePass_pull(ANodeQueuePass *pass, SceneNode *node)
{
  if (pass->basePass.index == pass->basePass.length)
  {

    QueuePass_apply(&pass->basePass);
  }
  pass->nodes[pass->basePass.index] = node;
  void *result = (*pass->pullFunction)(pass, node, pass->basePass.index);
  pass->basePass.index++;

  return result;
}

void *NodeQueuePass_pull(NodeQueuePass *pass, SceneNode *node, uint32_t index)
{
  return pass->resultData + index;
}

EMSCRIPTEN_KEEPALIVE void ANodeQueuePass_init(ANodeQueuePass *this, void *(*pullFunction)(ANodeQueuePass *pass, SceneNode *node, uint32_t index), uint32_t length, void (*bindFunction)(RenderPass *rp), void (*applyFunction)(RenderPass *rp))
{
  this->nodes = malloc(length * sizeof(SceneNode *));
  this->pullFunction = pullFunction;
  QueuePass_init(&this->basePass, length, bindFunction, applyFunction);
  // RenderPass_init(this->basePass.basePass,
}