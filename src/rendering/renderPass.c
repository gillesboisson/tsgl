#include <math.h>
#include <stdlib.h>
#include <stdbool.h>
#include <stdio.h>
#include "renderPass.h"
#include <emscripten.h>

void RenderPass_wasmApply(RenderPass *rp)
{
  EM_ASM({
    RenderPass_wasmApply($0);
  },
         rp);
}

void RenderPass_wasmBind(RenderPass *rp)
{
  EM_ASM({
    RenderPass_wasmBind($0);
  },
         rp);
}

EMSCRIPTEN_KEEPALIVE void RenderPass_initDefaultMethodsBinding(RenderPass *rp)
{
  rp->applyFunction = &RenderPass_wasmApply;
  rp->bindFunction = &RenderPass_wasmBind;
  // printf("> pass->bindFunction %p, pass->applyFunction %p \n", rp->bindFunction, rp->applyFunction);
}

EMSCRIPTEN_KEEPALIVE void QueuePass_print(QueuePass *this)
{
  printf("RenderPass %p, Index %i / Length %i\n", this, this->index, this->length);
}