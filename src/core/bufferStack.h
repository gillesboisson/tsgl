#ifndef CORE_STACK
#define CORE_STACK

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct{
    uint32_t length;
    uint32_t bufferLength;
    uint32_t bufferStep;
    void* bufferPtr;
    uint32_t bufferStride;
    bool autoShrink;
} BufferStack;



BufferStack* BufferStack_create(unsigned int stride);
void BufferStack_init(BufferStack* bs, unsigned int stride);
void BufferStack_resize(BufferStack* bs, unsigned int newLength, bool autoShrink);
void* BufferStack_add(BufferStack* bs, size_t amount);
void* BufferStack_removeLast(BufferStack* bs, size_t amount);
void BufferStack_reset(BufferStack* bs);
void BufferStack_destroy(BufferStack* bs);


#endif