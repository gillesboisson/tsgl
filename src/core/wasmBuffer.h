#ifndef WASM_BUFFER_CORE
#define WASM_BUFFER_CORE

#include <stdlib.h>
#include <stdbool.h>
#include <stdint.h>

typedef struct
{
  uint32_t length;
  uint32_t stride;
  void *buffer;

} WasmBuffer;

inline void *WasmBuffer_get(WasmBuffer *buffer, size_t ind)
{
  return ind < buffer->length ? buffer->buffer + ind * buffer->stride : NULL;
}

inline void *WasmBuffer_next(WasmBuffer *buffer, size_t *ind)
{
  return *ind < buffer->length ? buffer->buffer + (*ind)++ * buffer->stride : NULL;
}

inline bool WasmBuffer_has(WasmBuffer *buffer, size_t ind)
{
  return ind < buffer->length;
}

#endif