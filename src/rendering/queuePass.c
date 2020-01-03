#include <math.h>
#include <stdio.h>
#include <emscripten.h>
#include "queuePass.h"

EMSCRIPTEN_KEEPALIVE void QueuePass_print(QueuePass *this)
{
  printf("RenderPass %p, Index %i / Length %i\n", this, this->index, this->length);
}

void QueuePass_init(QueuePass *this, uint32_t length, void (*bindFunction)(RenderPass *rp), void (*applyFunction)(RenderPass *rp))
{
  this->index = 0;
  this->length = length;
  RenderPass_init(&this->basePass, bindFunction, applyFunction);
}
