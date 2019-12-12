#include "baseObjPool.h"
#include "bufferStack.h"
#include "objPool.h"
#include "helpers.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>
#include <stdio.h>
#include <emscripten.h>
#include "../glmatrix/glmatrix.h"


void Objpool_tests(){

    printf("********** \nCore tests\n**********\n");
    printf("-- Base Pools \n");
    BaseObjPool* pool = BaseObjPool_create(3 * sizeof(VecP));

    Vec3 v1 = BaseObjPool_pull(pool);
    Vec3_set(v1,1,2,3);
    Vec3 v2 = BaseObjPool_pull(pool);
    Vec3_set(v2,10,20,30);

    printf("2 object pulled \n");
    Vec3_print(v1);
    Vec3_print(v2);

    BaseObjPool_release(pool, v1);
    
   
    if(pool->availableElements.length != 1){
        printf("!! Nothing has been added to pool available buffer %i \n",pool->availableElements.length);
    }

    if(pool->availableElements.buffer[0] != v1){
        printf("!! Released object should be in pool available buffer \n");
    }

     Vec3 nVec = BaseObjPool_pull(pool);


    printf("1 object pulled from available \n");
    Vec3_print(nVec);
    if(v1 != nVec){
        printf("!! Error pulled object doesn't match the previous releaded one \n");
    }

    free(v1);
    free(v2);
    free(pool);
    free(nVec);

    printf("-- Pools \n");

    ObjPool* nPool = ObjPool_create(3 * sizeof(VecP));

    v1 = ObjPool_pull(nPool);
    Vec3_set(v1,1,2,3);
    v2 = ObjPool_pull(nPool);
    Vec3_set(v2,10,20,30);
    printf("2 object pulled \n");
    Vec3_print(v1);
    Vec3_print(v2);

    ObjPool_release(nPool, v1);
    
   
    if(nPool->basePool.availableElements.length != 1){
        printf("!! Nothing has been added to nPool->basePool available buffer %i \n",nPool->basePool.availableElements.length);
    }

    if(nPool->basePool.availableElements.buffer[0] != v1){
        printf("!! Released object should be in nPool->basePool available buffer \n");
        
    }

    nVec = ObjPool_pull(nPool);
    
    printf("1 object pulled from available \n");
    Vec3_print(nVec);
    if(v1 != nVec){
        printf("!! Error pulled object doesn't match the previous releaded one \n");
    }

    const size_t nbAllocElements = 10;

    printf("Pull allocation\n");

    ObjPool_allocate(nPool,nbAllocElements);

    if(nPool->elements.length != nbAllocElements + 2){
        printf("!! Error allocation failed pool should have 12 element rather then %i \n",nPool->elements.length);
    }

    if(nPool->basePool.availableElements.length != nbAllocElements){
        printf("!! Error allocation failed pool should have 10 available element rather then %i \n",nPool->basePool.availableElements.length);
    }
    

    Vec3 elements[nbAllocElements];
    printf("Pull all allocted element\n");
    
    for (size_t i = 0; i < nbAllocElements; i++)
    {
        elements[i] = ObjPool_pull(nPool);
        elements[i][0] = i*1.0;
        elements[i][1] = i*100.0;
        elements[i][2] = i*10000.0;
        
        printf("V%zu\n",i);
        Vec3_print(elements[i]);

    }

    if(nPool->basePool.availableElements.length != 0){
        printf("!! Pool availables should be empty\n");
    }
}


EMSCRIPTEN_KEEPALIVE void BufferStack_tests(BufferStack* stack){
    size_t nbElements = 132;
    BufferStack_add(stack, nbElements);
    for (size_t i = 0; i < nbElements; i++)
    {
        Vec3 v = stack->bufferPtr + i * stack->bufferStride;
        v[0] = i*10;
        v[1] = i*10 +1;
        v[2] = i*10 +2;
    }
}

EMSCRIPTEN_KEEPALIVE void BufferStack_tests_removeAndAdd(BufferStack* stack){
    uint32_t splitLength = floor(stack->length / 2);
    BufferStack_removeLast(stack, stack->length - splitLength);
    void* ptr = stack->bufferPtr + stack->length * stack->bufferStride;

    size_t nbNewElements = stack->length;
    
    BufferStack_add(stack,nbNewElements);
    for (size_t i = 0; i < nbNewElements; i++)
    {
        Vec3 v = ptr;
        v[0] = i*1000;
        v[1] = i*1000 + 1;
        v[2] = i*1000 + 2;
        ptr += stack->bufferStride;
    }
    
    
}
