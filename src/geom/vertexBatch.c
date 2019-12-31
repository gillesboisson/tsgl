#include "vertexBatch.h"
#include <emscripten.h>
#include <stdlib.h>
#include <stdio.h>

VertexBatch *VertexBatch_create(uint32_t length, uint32_t stride, void (*push)(VertexBatch *))
{
  VertexBatch *batch = malloc(sizeof(VertexBatch));
  VertexBatch_init(batch, length, stride, push);
  return batch;
}

void VertexBatch_init(VertexBatch *batch, uint32_t length, uint32_t stride, void (*push)(VertexBatch *))
{
  batch->length = length;
  batch->stride = stride;
  batch->push = push;
  batch->buffer = malloc(length * stride);
}

void VertexBatch_dispose(VertexBatch *batch)
{
  free(batch->buffer);
}

void VertexBatch_destroy(VertexBatch *batch)
{
  VertexBatch_dispose(batch);
  free(batch);
}

void VertexBatch_begin(VertexBatch *batch)
{
  batch->ind = 0;
}

void VertexBatch_reset(VertexBatch *batch)
{
  batch->ind = 0;
}

inline void VertexBatch_push(VertexBatch *batch)
{
  (*batch->push)(batch);
  batch->ind = 0;
}

void *VertexBatch_pull(VertexBatch *batch, uint32_t nbElements)
{
  if (batch->ind + nbElements >= batch->length)
    VertexBatch_push(batch);

  uint32_t ind = batch->ind;
  batch->ind += nbElements;
  return batch->buffer + ind * batch->stride;
}

void VertexBatch_end(VertexBatch *batch)
{
  if (batch->ind > 0)
    VertexBatch_push(batch);
}

//extern void VertexBatch_wasmPushDel(VertexBatch *batch);
