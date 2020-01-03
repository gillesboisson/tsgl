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
#include "geom/octoTree.h"
#include "geom/octoTreeGrid.h"
#include "geom/vertexElementBatch.h"
#include "core/helpers.h"
#include "rendering/renderPass.h"
#include "rendering/queuePass.h"
#include "rendering/queuePassCollection.h"
#include "rendering/nodeQueuePass.h"

//#include "./myClass.h"

#ifdef __cplusplus
extern "C"
{
#endif

  void QueuePassTest_bind(RenderPass *pass)
  {
    printf("> QueuePassTest_bind %p \n", pass);
  }

  void QueuePassTest_apply(RenderPass *pass)
  {
    printf("> QueuePassTest_apply %p \n", pass);
  }

  void *NodeQueuePassTest_pull(ANodeQueuePass *pass, SceneNode *node, uint32_t index)
  {
    printf("> NodeQueuePassTest_pull %p, Node : %p, index : %i \n", pass, node, index);
    return NULL;
  }

  EMSCRIPTEN_KEEPALIVE void testPassQueueCollection()
  {
    printf("> testPassQueueCollection \n");
    ANodeQueuePass *pass = malloc(sizeof(ANodeQueuePass));

    ANodeQueuePass_init(pass, &NodeQueuePassTest_pull, 16, &QueuePassTest_bind, &QueuePassTest_apply);

    for (size_t i = 0; i < 33; i++)
    {
      SceneNode *node = SceneNode_create();
      printf("> Create node %p \n", node);
      void *ptr = ANodeQueuePass_pull(pass, node);
    }

    // RenderPass_init(&pass->basePass.basePass, &QueuePassTest_bind, &QueuePassTest_apply);
  }

  /*
  void pushVertex(VertexElementBatch *batch)
  {
    for (size_t i = 0; i < batch->vertexInd; i++)
    {
      PositionColor *point = batch->vertexBuffer + batch->stride * i;
    }

    for (size_t i = 0; i < batch->indexInd; i += sizeof(uint16_t))
    {
      uint16_t *indexBuffer = batch->indexBuffer + i;
    }
  }

  EMSCRIPTEN_KEEPALIVE void testRenderingPass(RenderPass *pass)
  {
    printf("%p >> pass->bindFunction %p, pass->applyFunction %p \n", pass, pass->bindFunction, pass->applyFunction);
    (*pass->bindFunction)(pass);
    (*pass->applyFunction)(pass);
  }

  
  EMSCRIPTEN_KEEPALIVE void testBatch(VertexElementBatch *batch)

  {

    // uint32_t vInd;
    // uint32_t iInd;
    uint16_t *ind;
    PositionColor *positionColor;

    VertexElementBatch_print(batch);
    VertexElementBatch_begin(batch);
    for (size_t i = 0; i < 32; i++)
    {
      printf("--\n");
      uint32_t vPos = VertexElementBatch_pull(batch, 4, 6, &positionColor, &ind);

      Vec3_set(positionColor[0].position, -0.5, -0.5, 0);
      Vec3_set(positionColor[1].position, 0.5, -0.5, 0);
      Vec3_set(positionColor[2].position, 0.5, -0.5, 0);
      Vec3_set(positionColor[3].position, 0.5, 0.5, 0);

      for (size_t f = 0; f < 4; f++)
      {
        Vec4_set(positionColor[f].color, 1, 0, 1, 1);
      }

      ind[0] = vPos;
      ind[1] = vPos + 1;
      ind[2] = vPos + 3;
      ind[3] = vPos + 1;
      ind[4] = vPos + 3;
      ind[5] = vPos + 2;
    }

    VertexElementBatch_end(batch);
  }

  EMSCRIPTEN_KEEPALIVE void test()
  {

    VertexElementBatch *batch = VertexElementBatch_create(32, 10 * sizeof(uint16_t), sizeof(PositionColor), &pushVertex);
    PositionColor *point;
    uint16_t *index;

    for (size_t i = 0; i < 10; i++)
    {

      uint32_t vInd = VertexElementBatch_pull(batch, 3, 3 * sizeof(uint16_t), &point, &index);
      // PositionColor *point = VertexBatch_pull(batch, 3);
      for (size_t f = 0; f < 3; f++)
      {
        point[f].position[0] = i * 10 + f * 3;
        point[f].position[1] = i * 10 + f * 3 + 1;
        point[f].position[2] = i * 10 + f * 3 + 3;

        point[f].color[0] = i * 4;
        point[f].color[1] = i * 4 + 1;
        point[f].color[2] = i * 4 + 2;
        point[f].color[3] = i * 4 + 3;

        // printf("> points %i, x: %f,y: %f,z: %f,r: %f,g: %f,b: %f,a: %f \n", point + f, point[f].position[0], point[f].position[1], point[f].position[1], point[f].color[0], point[f].color[1], point[f].color[2], point[f].color[3]);
      }

      index[0] = vInd;
      index[1] = vInd + 1;
      index[2] = vInd + 2;

      // printf("> IND %i, %i \n", index, index[0]);
      // printf("> IND %i, %i \n", index + 1, index[1]);
      // printf("> IND %i, %i \n", index + 2, index[2]);
    }


    VertexBatch *batch = VertexBatch_create(10, sizeof(PositionColor), &pushVertex);

    for (size_t i = 0; i < 10; i++)
    {
      PositionColor *point = VertexBatch_pull(batch, 3);
      for (size_t f = 0; f < 3; f++)
      {
        point[f].position[0] = i * 10 + f * 3;
        point[f].position[1] = i * 10 + f * 3 + 1;
        point[f].position[2] = i * 10 + f * 3 + 3;

        point[f].color[0] = i * 4;
        point[f].color[1] = i * 4 + 1;
        point[f].color[2] = i * 4 + 2;
        point[f].color[3] = i * 4 + 3;

        printf("> points %i, x: %f,y: %f,z: %f,r: %f,g: %f,b: %f,a: %f \n", point + f, point[f].position[0], point[f].position[1], point[f].position[1], point[f].color[0], point[f].color[1], point[f].color[2], point[f].color[3]);
      }
    }

    
    OctoTreeGrid *grid = OctoTreeGrid_create(3, 3, 3, 3, 3, 3, 5, 5);

    Box bounds = Box_fromValues(1, 6, 1, 4, 4, 8);
    uint32_t nbTrees;
    OctoTree **trees = OctoTreeGrid_treesInBounds(&nbTrees, grid, bounds);

    printf("nbTrees for bounds %i \n", nbTrees);

    for (size_t i = 0; i < nbTrees; i++)
    {
      OctoTree *tree = *(trees + i);
      printf("Tree %zu %i\n", i, tree);
      Box_print(tree->bounds);
    }

    free(trees);

    
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
  // printf("WA1 test %f\n", this->myVar);
}

EMSCRIPTEN_KEEPALIVE void WA2_test_2(WA2 *this)
{
  WA1_test(&this->wa1);
  // printf("WA2 test %f\n", this->myVar2);
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
*/
#ifdef __cplusplus
}
#endif
