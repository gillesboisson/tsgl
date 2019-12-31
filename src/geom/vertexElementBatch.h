#ifndef GEOM_VERTEX_BATCH
#define GEOM_VERTEX_BATCH

#include "geom.h"
#include "helpers.h"

typedef struct VertexElementBatch VertexElementBatch;

struct VertexElementBatch
{
  void *vertexBuffer;
  void *indexBuffer;
  uint32_t vertexInd;
  uint32_t indexInd;
  uint32_t stride;
  uint32_t vertexLength;
  uint32_t indexLength;
  void (*push)(VertexElementBatch *);
};

VertexElementBatch *VertexElementBatch_create(uint32_t vertexLength, uint32_t indexLength, uint32_t stride, void (*push)(VertexElementBatch *));
void VertexElementBatch_init(VertexElementBatch *batch, uint32_t vertexLength, uint32_t indexLength, uint32_t stride, void (*push)(VertexElementBatch *));

void VertexElementBatch_destroy(VertexElementBatch *batch);
void VertexElementBatch_begin(VertexElementBatch *batch);
void VertexElementBatch_reset(VertexElementBatch *batch);
uint32_t VertexElementBatch_pull(VertexElementBatch *batch, uint32_t nbVertices, uint32_t nbIndices, void **vertex, void **index);
void VertexElementBatch_end(VertexElementBatch *batch);

void VertexElementBatch_dispose(VertexElementBatch *batch);

#endif