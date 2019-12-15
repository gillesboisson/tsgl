#include <math.h>
#include <stdlib.h>
#include <stdbool.h>
#include "camera.h"

#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE void Camera_mvp(Mat4 out, Camera *source, Mat4 modelMat)
{
  Mat4_multiply(out, source->node.worldMat, modelMat);
}

EMSCRIPTEN_KEEPALIVE void Camera_mvpStack(BufferStack *outBf, Camera *source, BufferStack *modelMatBf)
{

  for (size_t i = 0; i < outBf->length; i++)
  {
    Camera_mvp(BufferStack_get(outBf, i), source, BufferStack_get(modelMatBf, i));
  }

  /*
  while (matOut = (Mat4)BufferStack_next(outBf, &ind))
  {
    Camera_mvp(matOut, source, BufferStack_get(modelMatBf, ind - 1));
  }
  */
}