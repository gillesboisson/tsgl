#ifndef RENDER_NODE_QUEUE_PASS
#define RENDER_NODE_QUEUE_PASS

#include <stdint.h>
#include <stdbool.h>
#include "queuePass.h"
#include "../core/ptrBuffer.h"
#include "../core/wasmBuffer.h"
#include "../geom/sceneNodeResult.h"

typedef struct ANodeQueuePass ANodeQueuePass;

struct ANodeQueuePass
{
  QueuePass basePass;
  void *(*pullFunction)(ANodeQueuePass *rp, SceneNode *node, uint32_t index);
  void **nodes;
};

typedef struct
{
  ANodeQueuePass basePass;
  WasmBuffer *resultData;
} NodeQueuePass;

void ANodeQueuePass_init(ANodeQueuePass *this, void *(*pullFunction)(ANodeQueuePass *pass, SceneNode *node, uint32_t index), uint32_t length, void (*bindFunction)(RenderPass *rp), void (*applyFunction)(RenderPass *rp));

void *ANodeQueuePass_pull(ANodeQueuePass *pass, SceneNode *node);
void *NodeQueuePass_pull(ANodeQueuePass *pass, SceneNode *node, uint32_t index);

void NodeQueuePass_initDefaultPullFunction(NodeQueuePass *this, uint32_t length);
/*
inline void ANodeQueuePass_init(ANodeQueuePass *pass, uint32_t length)
{
  pass->nodes = malloc(sizeof(SceneNode *) * length);
}

inline void ANodeQueuePass_dispose(ANodeQueuePass *pass)
{
  free(pass->nodes);
}
*/

#endif