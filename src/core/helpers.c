
#include <stdio.h>
#include <stdlib.h>
#include <stdio.h>
#include <emscripten.h>

#include "helpers.h"

bool assert(bool condition, char *message)
{
  if (!condition)
  {
    printf("%s[X] %s \n", PRINT_RED, message);
  }
  else
  {
    printf("%s[V] %s \n", PRINT_GRN, message);
  }

  return condition;
}

void throwError(char *message)
{
  EM_ASM({
    throwWasmError($0);
  },
         message);
}