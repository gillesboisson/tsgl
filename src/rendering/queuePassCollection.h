#ifndef RENDER_PASS_QUEUE_COLLECTION
#define RENDER_PASS_QUEUE_COLLECTION

#include <stdint.h>
#include <stdbool.h>
#include "renderPass.h"

typedef struct
{
  QueuePass **queuePasses;
  uint32_t length;
} QueuePassCollection;

inline void QueuePassCollection_apply(QueuePassCollection *this)
{
  for (size_t i = 0; i < this->length; i++)
  {
    (*this->queuePasses[i]->basePass.applyFunction)(&this->queuePasses[i]->basePass);
  }
}

void QueuePassCollection_print(QueuePassCollection *this);

#endif
