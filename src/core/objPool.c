#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>

#include "objPool.h"

void ObjPool_release(ObjPool* pool, void* ptr){
    BaseObjPool_release(&pool->basePool,ptr);
}

void ObjPool_init(ObjPool* pool, size_t elementSize){
    BaseObjPool_init(&pool->basePool,elementSize);
    PtrBuffer_init(&pool->elements);
}

ObjPool* ObjPool_create(size_t elementSize){
    ObjPool* pool = malloc(sizeof(ObjPool));
    ObjPool_init(pool, elementSize);
    return pool;
}

void* ObjPool_pull(ObjPool* pool){
    void* ptr = PtrBuffer_pop(&pool->basePool.availableElements,true);
    if(ptr != NULL) return ptr;

    ptr = malloc(pool->basePool.elementSize);
    PtrBuffer_push(&pool->elements,ptr);
    return ptr;
}

void ObjPool_reset(ObjPool* pool){
    PtrBuffer_resizeBuffer(&pool->basePool.availableElements, 0);
    PtrBuffer_resizeBuffer(&pool->elements, 0);
}

void ObjPool_allocate(ObjPool* pool, size_t nbElements){
    void* ptr = malloc(nbElements * pool->basePool.elementSize);
    for (size_t i = 0; i < nbElements; i++)
    {
        PtrBuffer_push(&pool->basePool.availableElements,ptr);
        PtrBuffer_push(&pool->elements,ptr);
        ptr += pool->basePool.elementSize;
    }
}

void ObjPool_destroy(ObjPool* pool){
    for (size_t i = 0; i < pool->elements.length; i++)
    {
        free(pool->elements.buffer[i]);
    }
    free(pool);
}

