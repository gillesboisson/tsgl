
#ifndef COREObjPool
#define COREObjPool

#include "baseObjPool.h"
#include "ptrBuffer.h"

typedef struct
{
  BaseObjPool basePool;
  PtrBuffer elements;
} ObjPool;

ObjPool *ObjPool_create(size_t elementSize);
void *ObjPool_pull(ObjPool *pool);
void ObjPool_reset(ObjPool *pool);

void ObjPool_destroy(ObjPool *pool);

void ObjPool_release(ObjPool *pool, void *ptr);

void ObjPool_init(ObjPool *pool, size_t elementSize);

void ObjPool_allocate(ObjPool *pool, size_t nbElements);

#endif