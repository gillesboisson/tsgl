#ifndef GEOM_VERTEX_BATCH
#define GEOM_VERTEX_BATCH

#include "geom.h"
#include "helpers.h"

typedef struct VertexBatch VertexBatch;

struct VertexBatch
{
  void *buffer;
  uint32_t ind;
  uint32_t stride;
  uint32_t length;
  void (*push)(VertexBatch *);
} ;


VertexBatch *VertexBatch_create(uint32_t length, uint32_t stride, void (*push)(VertexBatch *));
void VertexBatch_destroy(VertexBatch *batch);
void VertexBatch_begin(VertexBatch *batch);
void VertexBatch_reset(VertexBatch *batch);
void *VertexBatch_pull(VertexBatch *batch, uint32_t nbElements);
void VertexBatch_end(VertexBatch *batch);

void VertexBatch_init(VertexBatch *batch, uint32_t length, uint32_t stride, void (*push)(VertexBatch *));
void VertexBatch_dispose(VertexBatch *batch);


#endif