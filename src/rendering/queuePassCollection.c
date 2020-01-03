
#include <math.h>
#include <stdio.h>
#include <emscripten.h>
#include "queuePassCollection.h"

EMSCRIPTEN_KEEPALIVE void QueuePassCollection_print(QueuePassCollection *this)
{
  printf("QueuePassCollection %p : Length %i \n", this, this->length);
  for (size_t i = 0; i < this->length; i++)
  {
    QueuePass_print(this->queuePasses[i]);
  }
}