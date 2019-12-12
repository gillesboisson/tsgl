#ifndef COREBPOOL
#define COREBPOOL

#include "ptrBuffer.h"



struct BaseObjPool{
    unsigned int elementSize;
    PtrBuffer availableElements;
};

typedef struct BaseObjPool BaseObjPool;

BaseObjPool* BaseObjPool_create(size_t elementSize);
void BaseObjPool_destroy(BaseObjPool* pool);
void BaseObjPool_init(BaseObjPool* out, size_t elementSize);
void* BaseObjPool_pull(BaseObjPool* pool);
void BaseObjPool_release(BaseObjPool* pool, void* ptr);
void BaseObjPool_reset(BaseObjPool* pool);

#endif