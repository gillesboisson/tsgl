#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>

#include "helpers.h"
#include "ptrBuffer.h"
#include <emscripten/emscripten.h>

#define PTR_BUFFER_DEFAULT_LENGTH 32
#define PTR_BUFFER_DEFAULT_STEP 32

void PtrBuffer_init(PtrBuffer *out)
{
  out->length = 0;
  out->bufferLength = PTR_BUFFER_DEFAULT_LENGTH;
  out->bufferStep = PTR_BUFFER_DEFAULT_STEP;
  out->buffer = safeMalloc(out->bufferLength * sizeof(uint32_t), "PtrBuffer_init : allocate buffer");
  out->dirtyBuffer = true;
}

void PtrBuffer_resizeBuffer(PtrBuffer *out, uint32_t newLength)
{

  uint32_t newBufferLength = ceil((newLength > out->length ? newLength : (double)out->length) / (double)out->bufferStep) * out->bufferStep;

  // printf("PtrBuffer_resizeBuffer buffer length %i, newLength %i\n", out->bufferLength, newLength);

  if (newBufferLength != out->bufferLength)
  {
    out->buffer = safeRealloc(out->buffer, newBufferLength * sizeof(uint32_t), "PtrBuffer_resizeBuffer");
    out->bufferLength = newBufferLength;
    out->dirtyBuffer = true;
  }
}

void PtrBuffer_resize(PtrBuffer *out, uint32_t newLength, bool resizeBuffer)
{
  out->length = newLength;
  if (resizeBuffer)
    PtrBuffer_resizeBuffer(out, newLength);
}

PtrBuffer *PtrBuffer_create()
{
  PtrBuffer *out = malloc(sizeof(PtrBuffer));

  PtrBuffer_init(out);
  return out;
}

void PtrBuffer_push(PtrBuffer *out, void *ptr)
{
  PtrBuffer_resize(out, out->length + 1, true);
  out->buffer[out->length - 1] = ptr;
}

void PtrBuffer_pushMany(PtrBuffer *out, PtrBuffer *in, bool uniqueOnly, bool resizeBuffer)
{
  int ind = out->length;
  PtrBuffer_resizeBuffer(out, out->length + in->length);
  for (size_t i = 0; i < in->length; i++)
  {
    if (uniqueOnly == false || PtrBuffer_indexOf(out, in->buffer[i]))
    {
      out->buffer[ind++] = in->buffer[i];
    }
  }

  PtrBuffer_resize(out, ind, resizeBuffer);
}

bool PtrBuffer_remove(PtrBuffer *out, void *ptr, bool resizeBuffer)
{
  bool found = false;
  for (size_t i = 0; i < out->length - 1; i++)
  {
    if (!found && out->buffer[i] == ptr)
      found = true;
    if (found)
      out->buffer[i] = out->buffer[i + 1];
  }
  PtrBuffer_resize(out, out->length - 1, resizeBuffer);
  return found;
}

void *PtrBuffer_pop(PtrBuffer *out, bool resizeBuffer)
{
  if (out->length == 0)
    return NULL;
  void *ptr = out->buffer[out->length - 1];
  PtrBuffer_resize(out, out->length - 1, resizeBuffer);
  return ptr;
}

PtrBuffer *PtrBuffer_clear(PtrBuffer *out, bool resizeBuffer)
{
  out->length = 0;
  if (resizeBuffer)
    PtrBuffer_resizeBuffer(out, out->bufferStep);
  return out;
}

void PtrBuffer_dispose(PtrBuffer *out)
{
  free(out->buffer);
}

void PtrBuffer_destroy(PtrBuffer *out)
{
  PtrBuffer_dispose(out);
  free(out);
}

EMSCRIPTEN_KEEPALIVE void PtrBuffer_print(PtrBuffer *out)
{
  printf("Buffer %u %u %u %u %u %u \n", (unsigned int)out, out->dirtyBuffer, out->length, out->bufferLength, out->bufferStep, (unsigned int)out->buffer);
}

EMSCRIPTEN_KEEPALIVE void PtrBuffer_printBuffer(PtrBuffer *out)
{
  for (size_t i = 0; i < out->length; i += 16)
  {

    assert(true, "TEST OK");
    assert(false, "TEST NON OK");

    printf("Buffer %u %u %u %u %u %u %u %u %u %u %u %u %u %u %u %u \n",
           (unsigned int)out->buffer[i],
           (unsigned int)out->buffer[i + 1],
           (unsigned int)out->buffer[i + 2],
           (unsigned int)out->buffer[i + 3],
           (unsigned int)out->buffer[i + 4],
           (unsigned int)out->buffer[i + 5],
           (unsigned int)out->buffer[i + 6],
           (unsigned int)out->buffer[i + 7],
           (unsigned int)out->buffer[i + 8],
           (unsigned int)out->buffer[i + 9],
           (unsigned int)out->buffer[i + 10],
           (unsigned int)out->buffer[i + 11],
           (unsigned int)out->buffer[i + 12],
           (unsigned int)out->buffer[i + 13],
           (unsigned int)out->buffer[i + 14],
           (unsigned int)out->buffer[i + 15]);
  }
}

size_t PtrBuffer_indexOf(PtrBuffer *buffer, void *ptr)
{
  for (size_t i = 0; i < buffer->length; i++)
  {
    if (buffer->buffer + i == ptr)
      return i;
  }
  return -1;
}

void PtrBuffer_tests()
{
  PtrBuffer *in = PtrBuffer_create();
  PtrBuffer *out = PtrBuffer_create();

  for (size_t i = 0; i < 18; i++)
  {
    void *node = safeMalloc(sizeof(uint16_t), "PtrBuffer_tests");
    PtrBuffer_push(in, node);
    if (i % 3 == 10)
      PtrBuffer_push(in, node);
  }

  PtrBuffer_pushMany(out, in, false, true);

  assert(out->length == in->length, "out length should be equal to in length");

  PtrBuffer_resize(out, 0, true);

  PtrBuffer_pushMany(out, in, true, true);

  assert(out->length == 18, "out length should be equal to original iteration size");
}