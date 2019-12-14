#include <stdio.h>
#include <math.h>
#include <stdlib.h>

#include <emscripten/emscripten.h>
#include "./glmatrix/glmatrix.h"
#include "./core/ptrBuffer.h"
#include "geom/tests.h"
#include "geom/transform.h"
#include "core/test.h"

//#include "./myClass.h"

#ifdef __cplusplus
extern "C"
{
#endif

  typedef struct
  {
    VecP position[2];
    VecP velocity[2];
  } PositionVelocity;

  EMSCRIPTEN_KEEPALIVE void randomVBuffer(PositionVelocity *buffer, size_t length)
  {
    for (size_t i = 0; i < length; i++)
    {
      buffer[i].position[0] = (VecP)((((double)rand() / (RAND_MAX))) * 2.0 - 1.0);
      buffer[i].position[1] = (VecP)((((double)rand() / (RAND_MAX))) * 2.0 - 1.0);

      buffer[i].velocity[0] = (VecP)((((double)rand() / (RAND_MAX))) * 0.02 - 0.01);
      buffer[i].velocity[1] = (VecP)((((double)rand() / (RAND_MAX))) * 0.02 - 0.01);
    }
  }

  EMSCRIPTEN_KEEPALIVE void applyTransformFeeback(PositionVelocity *buffer, size_t length)
  {
    for (size_t i = 0; i < length; i++)
    {

      buffer[i].velocity[0] = buffer[i].velocity[0] - buffer[i].velocity[0] / 1000.0;
      buffer[i].velocity[1] = buffer[i].velocity[1] - buffer[i].velocity[1] / 1000.0 - 0.001;

      buffer[i].position[0] = buffer[i].position[0] + buffer[i].velocity[0];
      buffer[i].position[1] = buffer[i].position[1] + buffer[i].velocity[1];

      if (buffer[i].position[1] < -1.0)
      {
        buffer[i].velocity[1] = -buffer[i].velocity[1];
        buffer[i].position[1] = -1.0;
      }
      if (buffer[i].position[0] < -1.0)
      {
        buffer[i].velocity[0] = -buffer[i].velocity[0];
        buffer[i].position[0] = -1.0;
      }
      if (buffer[i].position[0] > 1.0)
      {
        buffer[i].velocity[0] = -buffer[i].velocity[0];
        buffer[i].position[0] = 1.0;
      }
    }
  }

#ifdef __cplusplus
}
#endif
