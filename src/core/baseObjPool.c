#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>

#include "baseObjPool.h"

void BaseObjPool_init(BaseObjPool* out, size_t elementSize){
    out->elementSize = elementSize;
    PtrBuffer_init(&out->availableElements);
}

BaseObjPool* BaseObjPool_create(size_t elementSize){
    BaseObjPool* out = malloc(sizeof(BaseObjPool));
    BaseObjPool_init(out,elementSize);
    return out;
}

void* BaseObjPool_pull(BaseObjPool* pool){
    void* ptr = PtrBuffer_pop(&pool->availableElements,true);
    if(ptr != NULL) return ptr;

    return malloc(pool->elementSize);
}

void BaseObjPool_release(BaseObjPool* pool, void* ptr){
    PtrBuffer_push(&pool->availableElements, ptr);
}

void BaseObjPool_reset(BaseObjPool* pool){
    PtrBuffer_resizeBuffer(&pool->availableElements, 0);
}

void BaseObjPool_destroy(BaseObjPool* pool){
    free(pool);
}

