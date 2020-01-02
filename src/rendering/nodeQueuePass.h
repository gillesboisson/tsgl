#ifndef RENDER_NODE_QUEUE_PASS
#define RENDER_NODE_QUEUE_PASS

#include <stdint.h>
#include <stdbool.h>
#include "renderPass.h"
#include "../core/ptrBuffer.h"
#include "../core/wasmBuffer.h"

typedef struct
{
  QueuePass basePass;
  PtrBuffer buffer;
} ANodeQueuePass;

typedef struct
{
  VecP mvp[16];
  VecP model[16];
  VecP rotation[16];
} NodeResult;

typedef struct
{
  ANodeQueuePass basePass;
  WasmBuffer *resultData;
} NodeQueuePass;

#endif