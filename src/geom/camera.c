#include <math.h>
#include <stdlib.h>
#include <stdbool.h>
#include "camera.h"

#include <emscripten.h>

/*
EMSCRIPTEN_KEEPALIVE void Camera_mvpStack(BufferStack *outBf, Camera *source, BufferStack *modelMatBf)
{

  for (size_t i = 0; i < outBf->length; i++)
  {
    Camera_mvp(BufferStack_get(outBf, i), source, BufferStack_get(modelMatBf, i));
  }
}
*/