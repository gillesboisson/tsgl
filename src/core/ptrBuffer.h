#ifndef PTRBUFFER
#define PTRBUFFER

#include <stdlib.h>
#include <stdbool.h>

typedef struct
{
  bool dirtyBuffer;
  int length;
  int bufferLength;
  int bufferStep;
  void **buffer;
} PtrBuffer;

PtrBuffer *PtrBuffer_create();

void PtrBuffer_resizeBuffer(PtrBuffer *out, unsigned int newLength);
void PtrBuffer_resize(PtrBuffer *out, unsigned int newLength, bool resizeBuffer);

void PtrBuffer_push(PtrBuffer *out, void *ptr);
void PtrBuffer_pushMany(PtrBuffer *out, PtrBuffer *in, bool uniqueOnly, bool resizeBuffer);
bool PtrBuffer_remove(PtrBuffer *out, void *ptr, bool resizeBuffer);
void PtrBuffer_dispose(PtrBuffer *out);
void PtrBuffer_destroy(PtrBuffer *out);
size_t PtrBuffer_indexOf(PtrBuffer *buffer, void *ptr);
PtrBuffer *PtrBuffer_clear(PtrBuffer *out, bool resizeBuffer);
void PtrBuffer_init(PtrBuffer *out);
void *PtrBuffer_pop(PtrBuffer *out, bool resizeBuffer);
void PtrBuffer_print(PtrBuffer *out);
void PtrBuffer_tests();

#endif