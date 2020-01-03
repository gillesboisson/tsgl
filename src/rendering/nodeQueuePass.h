#ifndef RENDER_NODE_QUEUE_PASS
#define RENDER_NODE_QUEUE_PASS

#include <stdint.h>
#include <stdbool.h>
#include "renderPass.h"
#include "../core/ptrBuffer.h"
#include "../core/wasmBuffer.h"

typedef struct
{
  void *(*pullFunction)(RenderPass *rp, SceneNode *node, uint32_t index);
  QueuePass basePass;
  void **nodes;
} ANodeQueuePass;

typedef struct
{
  VecP mvp[16];
  VecP model[16];
  VecP rotation[16];
} SceneNodeResult;

typedef struct
{
  ANodeQueuePass basePass;
  WasmBuffer *resultData;
} NodeQueuePass;

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