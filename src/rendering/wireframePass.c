#include <math.h>
#include <stdio.h>
#include <emscripten.h>
#include "wireframePass.h"

VecP const BOX_POSITIONS[] = {
    -1,
    -1,
    1,
    1,

    1,
    -1,
    1,
    1,

    -1,
    1,
    1,
    1,

    1,
    1,
    1,
    1,

    -1,
    -1,
    -1,
    1,

    1,
    -1,
    -1,
    1,

    -1,
    1,
    -1,
    1,

    1,
    1,
    -1,
    1,

};

void pushBoxIndices(IndexType *indexBuffer, uint32_t positionOffset)
{
  indexBuffer[0] = positionOffset;
  indexBuffer[1] = positionOffset + 1;
  indexBuffer[2] = positionOffset + 1;
  indexBuffer[3] = positionOffset + 3;
  indexBuffer[4] = positionOffset + 3;
  indexBuffer[5] = positionOffset + 2;
  indexBuffer[6] = positionOffset + 2;
  indexBuffer[7] = positionOffset;

  indexBuffer[8] = positionOffset + 4;
  indexBuffer[9] = positionOffset + 5;
  indexBuffer[10] = positionOffset + 5;
  indexBuffer[11] = positionOffset + 7;
  indexBuffer[12] = positionOffset + 7;
  indexBuffer[13] = positionOffset + 6;
  indexBuffer[14] = positionOffset + 6;
  indexBuffer[15] = positionOffset + 4;

  indexBuffer[16] = positionOffset;
  indexBuffer[17] = positionOffset + 4;
  indexBuffer[18] = positionOffset + 1;
  indexBuffer[19] = positionOffset + 5;
  indexBuffer[20] = positionOffset + 2;
  indexBuffer[21] = positionOffset + 6;
  indexBuffer[22] = positionOffset + 3;
  indexBuffer[23] = positionOffset + 7;
}

EMSCRIPTEN_KEEPALIVE void WireframePass_pushBox(WireframePass *wireframe, Box box, Vec4 color)
{
  IndexType *indexBuffer;
  PositionColor *vertexBuffer;

  uint32_t positionOffset = VertexElementBatch_pull(&wireframe->base, 8, sizeof(IndexType) * 24, (void **)&vertexBuffer, (void **)&indexBuffer);
  pushBoxIndices(indexBuffer, positionOffset);

  vertexBuffer[0].position[0] = box[0];
  vertexBuffer[0].position[1] = box[2];
  vertexBuffer[0].position[2] = box[4];

  vertexBuffer[1].position[0] = box[1];
  vertexBuffer[1].position[1] = box[2];
  vertexBuffer[1].position[2] = box[4];

  vertexBuffer[2].position[0] = box[0];
  vertexBuffer[2].position[1] = box[3];
  vertexBuffer[2].position[2] = box[4];

  vertexBuffer[3].position[0] = box[1];
  vertexBuffer[3].position[1] = box[3];
  vertexBuffer[3].position[2] = box[4];

  vertexBuffer[4].position[0] = box[0];
  vertexBuffer[4].position[1] = box[2];
  vertexBuffer[4].position[2] = box[5];

  vertexBuffer[5].position[0] = box[1];
  vertexBuffer[5].position[1] = box[2];
  vertexBuffer[5].position[2] = box[5];

  vertexBuffer[6].position[0] = box[0];
  vertexBuffer[6].position[1] = box[3];
  vertexBuffer[6].position[2] = box[5];

  vertexBuffer[7].position[0] = box[1];
  vertexBuffer[7].position[1] = box[3];
  vertexBuffer[7].position[2] = box[5];

  for (size_t i = 0; i < 8; i++)
  {
    Vec4_copy((vertexBuffer + i)->color, color);
  }
}

EMSCRIPTEN_KEEPALIVE void WireframePass_pushBoxes(WireframePass *wireframe, Box *box, uint32_t nbBoxes, Vec4 color)
{
  for (uint32_t i = 0; i < nbBoxes; i++)
  {
    WireframePass_pushBox(wireframe, box[i], color);
  }
}

EMSCRIPTEN_KEEPALIVE void WireframePass_pushOctoTree(WireframePass *this, OctoTree *tree, Vec4 color, float colorTransform)
{
  VecP changedColor[4];
  WireframePass_pushBox(this, tree->bounds, color);
  if (tree->children != NULL && colorTransform > 0)
  {
    Vec4_scale(changedColor, color, colorTransform);

    for (size_t i = 0; i < 8; i++)
    {
      WireframePass_pushOctoTree(this, tree->children + i, changedColor, colorTransform);
    }
  }
}

EMSCRIPTEN_KEEPALIVE void WireframePass_pushOctoTreeGrid(WireframePass *this, OctoTreeGrid *grid, Vec4 color, float colorTranform)
{
  size_t nbTrees = grid->nbBoxX * grid->nbBoxY * grid->nbBoxZ;

  for (size_t i = 0; i < nbTrees; i++)
  {
    WireframePass_pushOctoTree(this, grid->trees + i, color, colorTranform);
  }
}

EMSCRIPTEN_KEEPALIVE void WireframePass_pushCamera(WireframePass *this, Camera *camera, Vec4 color)
{
  VecP invMat[16];
  VecP _vec4[4];
  Mat4_multiply(invMat, camera->projectionMat, camera->node.worldMat);
  Mat4_invert(invMat, invMat);

  IndexType *indexBuffer;
  PositionColor *vertexBuffer;

  uint32_t positionOffset = VertexElementBatch_pull(&this->base, 8, sizeof(IndexType) * 24, (void **)&vertexBuffer, (void **)&indexBuffer);

  pushBoxIndices(indexBuffer, positionOffset);

  for (uint32_t i = 0; i < 8; i++, vertexBuffer++)
  {
    Vec4 boxP = (Vec4)(BOX_POSITIONS + i * 4);
    Vec4_transformMat4(_vec4, boxP, invMat);
    Vec3_set(vertexBuffer->position, _vec4[0] / _vec4[3], _vec4[1] / _vec4[3], _vec4[2] / _vec4[3]);
    Vec4_copy(vertexBuffer->color, color);
  }
}