#include <math.h>
#include <stdio.h>
#include <emscripten.h>
#include "../geom/geom.h"
#include "nodeQueuePass.h"

EMSCRIPTEN_KEEPALIVE void ANodeQueuePass_init(ANodeQueuePass *pass)
{
  PtrBuffer_init(&pass->buffer);
}

EMSCRIPTEN_KEEPALIVE void ANodeQueuePass_dispose(ANodeQueuePass *pass)
{
  PtrBuffer_dispose(&pass->buffer);
}
