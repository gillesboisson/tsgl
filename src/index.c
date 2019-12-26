#include <stdio.h>
#include <math.h>
#include <stdlib.h>

#include <emscripten/emscripten.h>
#include "./glmatrix/glmatrix.h"
#include "./core/ptrBuffer.h"
#include "geom/tests.h"
#include "geom/transform.h"
#include "geom/camera.h"
#include "geom/sceneNodeResult.h"
#include "core/test.h"
#include "core/wasmBuffer.h"
#include "geom/octotree.h"

//#include "./myClass.h"

#ifdef __cplusplus
extern "C"
{
#endif

  EMSCRIPTEN_KEEPALIVE void test()
  {
    Box bounds = Box_fromValues(0, 10, 0, 10, 0, 10);
    OctoTree *tree = OctoTree_create(bounds, 3, 5, NULL);
    VecP position[] = {5, 5, 5};
    VecP size[] = {6, 6, 6};
    for (size_t i = 0; i < 9; i++)
    {
      SceneNode *node = SceneNode_create();

      Box_setCenterSize(node->bounds, position, size);

      OctoTree_addNode(tree, node, true);

      printf("tree %i \n", tree->elements.length);
    }

    OctoTree_destroy(tree);
    free(bounds);
  }

  typedef struct
  {
    VecP myVar;
  } WA1;
  typedef struct
  {
    WA1 wa1;
    VecP myVar2;
  } WA2;

  EMSCRIPTEN_KEEPALIVE void batchNodes(Camera *cam, WasmBuffer *nodes, WasmBuffer *results)
  {
    for (size_t ind = 0; WasmBuffer_has(nodes, ind); ind++)
    {
      SceneNode *node = WasmBuffer_get(nodes, ind);
      SceneNodeResult *result = WasmBuffer_get(results, ind);

      //SceneNode_updateWorldMat(node, NULL, false);
      SceneNodeResult_compute(result, cam, node);
    }
  }

  EMSCRIPTEN_KEEPALIVE void WA1_test(WA1 *this)
  {
    printf("WA1 test %f\n", this->myVar);
  }

  EMSCRIPTEN_KEEPALIVE void WA2_test_2(WA2 *this)
  {
    WA1_test(&this->wa1);
    printf("WA2 test %f\n", this->myVar2);
  }

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

  EMSCRIPTEN_KEEPALIVE void testDynamicLocalTransform(Transform *t)
  {
    void (*updateLocalMethod)(Transform * t) = &Transform_updateLocalMat;
  }

#ifdef __cplusplus
}
#endif
