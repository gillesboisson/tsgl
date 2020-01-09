#include "vertexElementBatch.h"
#include <emscripten.h>
#include <stdlib.h>
#include <stdio.h>
#include "../core/helpers.h"

VertexElementBatch *VertexElementBatch_create(uint32_t vertexLength, uint32_t indexLength, uint32_t stride, void (*push)(VertexElementBatch *))
{
  VertexElementBatch *batch = malloc(sizeof(VertexElementBatch));
  VertexElementBatch_init(batch, vertexLength, indexLength, stride, push);
  return batch;
}

void VertexElementBatch_init(VertexElementBatch *batch, uint32_t vertexLength, uint32_t indexLength, uint32_t stride, void (*push)(VertexElementBatch *))
{
  batch->vertexLength = vertexLength;
  batch->indexLength = indexLength;
  batch->stride = stride;
  batch->push = push;
  batch->vertexBuffer = safeMalloc(vertexLength * stride, "VertexElementBatch_init : allocate vertex buffer");
  batch->indexBuffer = safeMalloc(indexLength, "VertexElementBatch_init : allocate index buffer");
}

EMSCRIPTEN_KEEPALIVE void VertexElementBatch_dispose(VertexElementBatch *batch)
{
  free(batch->vertexBuffer);
  free(batch->indexBuffer);
}

void VertexElementBatch_destroy(VertexElementBatch *batch)
{
  VertexElementBatch_dispose(batch);
  free(batch);
}

void VertexElementBatch_begin(VertexElementBatch *batch)
{
  batch->vertexInd = 0;
  batch->indexInd = 0;
}

void VertexElementBatch_reset(VertexElementBatch *batch)
{
  batch->vertexInd = 0;
  batch->indexInd = 0;
}

inline void VertexElementBatch_push(VertexElementBatch *batch)
{
  (*batch->push)(batch);
  batch->vertexInd = 0;
  batch->indexInd = 0;
}

uint32_t VertexElementBatch_pull(VertexElementBatch *batch, uint32_t nbVertices, uint32_t nbIndices, void **vertex, void **index)
{
  if (batch->vertexInd + nbVertices >= batch->vertexLength || batch->indexInd + nbIndices >= batch->indexLength)
    VertexElementBatch_push(batch);

  uint32_t vertexInd = batch->vertexInd;
  batch->vertexInd += nbVertices;
  uint32_t indexInd = batch->indexInd;
  batch->indexInd += nbIndices;
  *vertex = batch->vertexBuffer + vertexInd * batch->stride;
  *index = batch->indexBuffer + indexInd;

  return vertexInd;
}

void VertexElementBatch_print(VertexElementBatch *batch)
{
  printf("Batch %i, vertexLength %i, stride %i, indexLength %i\n", (uint32_t)batch, batch->vertexLength, batch->stride, batch->indexLength);
}

void VertexElementBatch_end(VertexElementBatch *batch)
{
  if (batch->vertexInd > 0 || batch->indexInd > 0)
    VertexElementBatch_push(batch);
}

EMSCRIPTEN_KEEPALIVE void VertexElementBatch_wasmPush(VertexElementBatch *batch)
{
  EM_ASM({
    VertexElementBatch_wasmPush($0);
  },
         batch);
}

EMSCRIPTEN_KEEPALIVE void VertexElementBatch_initForWasm(VertexElementBatch *batch, uint32_t vertexLength, uint32_t indexLength, uint32_t stride)
{
  batch->vertexLength = vertexLength;
  batch->indexLength = indexLength;
  batch->stride = stride;
  batch->push = &VertexElementBatch_wasmPush;
  batch->vertexBuffer = safeMalloc(vertexLength * stride, "VertexElementBatch_initForWasm : alloc vertex buffer");
  batch->indexBuffer = safeMalloc(indexLength, "VertexElementBatch_initForWasm : alloc index buffer");
}
