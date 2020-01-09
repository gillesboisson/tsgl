#ifndef CORE_HELPERS
#define CORE_HELPERS
#include <stdlib.h>
#include <stdbool.h>
#include "../config.h"
#define PRINT_RED "\x1B[31m"
#define PRINT_GRN "\x1B[32m"
#define PRINT_YEL "\x1B[33m"
#define PRINT_BLU "\x1B[34m"
#define PRINT_MAG "\x1B[35m"
#define PRINT_CYN "\x1B[36m"
#define PRINT_WHT "\x1B[37m"
#define PRINT_RESET "\x1B[0m"

bool assert(bool condition, char *message);

void throwError(char *message);

#ifdef SAFE_MALLOC
inline void *safeMalloc(size_t size, char *message)
{
  char finalMessage[1024];
  void *ptr = malloc(size);
  if (ptr == NULL)
  {
    sprintf(finalMessage, "Malloc failed %s", message);
    throwError(finalMessage);
  }
  return ptr;
}

inline void *safeRealloc(void *prevPtr, size_t size, char *message)
{
  char finalMessage[1024];
  void *ptr = realloc(prevPtr, size);
  if (ptr == NULL)
  {
    sprintf(finalMessage, "Realloc failed %s", message);
    throwError(finalMessage);
  }
  return ptr;
}

#else
inline void *safeMalloc(size_t size, char *message)
{
  return malloc(size);
}

inline void *safeRealloc(void *prevPtr, size_t size, char *message)
{
  return realloc(prevPtr, size);
}

#endif

#endif