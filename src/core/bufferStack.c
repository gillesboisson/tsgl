#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>

#include "helpers.h"
#include "bufferStack.h"
#include <emscripten/emscripten.h>

#define BUFFER_STACK_DEFAULT_LENGTH 32
#define BUFFER_STACK_DEFAULT_STEP 32

BufferStack *BufferStack_create(uint32_t stride)
{
  BufferStack *bs = malloc(sizeof(BufferStack));
  BufferStack_init(bs, stride);
  return bs;
}

void BufferStack_init(BufferStack *bs, uint32_t stride)
{
  bs->bufferStride = stride;
  bs->length = 0;
  bs->bufferLength = BUFFER_STACK_DEFAULT_LENGTH;
  bs->bufferStep = BUFFER_STACK_DEFAULT_STEP;
  bs->bufferPtr = safeMalloc(BUFFER_STACK_DEFAULT_LENGTH * stride, "BufferStack_init : buffer allocation");
  bs->autoShrink = false;
}

void BufferStack_resize(BufferStack *bs, uint32_t newLength, bool autoShrink)
{
  uint32_t newBufferLength = newLength > 0 ? ceil(newLength / bs->bufferStep) * bs->bufferStep : bs->bufferStep;

  if (newBufferLength > bs->bufferLength || autoShrink && newBufferLength != bs->bufferLength)
  {
    bs->bufferPtr = safeRealloc(bs->bufferPtr, newBufferLength * bs->bufferStride, "BufferStack_resize");
    bs->bufferLength = newBufferLength;
  }
  bs->length = newLength;
}

void *BufferStack_add(BufferStack *bs, size_t amount)
{
  void *ptr = bs->bufferPtr + bs->length * bs->bufferStride;
  BufferStack_resize(bs, bs->length + amount, bs->autoShrink);
  return ptr;
}
void *BufferStack_removeLast(BufferStack *bs, size_t amount)
{
  BufferStack_resize(bs, bs->length - amount, bs->autoShrink);
  return bs->bufferPtr + bs->length * bs->bufferStride;
}

void BufferStack_reset(BufferStack *bs)
{
  BufferStack_resize(bs, 0, true);
}
void BufferStack_destroy(BufferStack *bs)
{
  free(bs->bufferPtr);
  free(bs);
}

void *BufferStack_get(BufferStack *bs, uint32_t index)
{
  return bs->bufferPtr + index * bs->bufferStride;
}

void *BufferStack_next(BufferStack *bs, uint32_t *index)
{
  if (*index < bs->length)
  {
    return bs->bufferPtr + (*index)++ * bs->bufferStride;
  }
  return NULL;
}