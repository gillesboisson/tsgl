#ifndef RENDER_WIREFRAMEPASS
#define RENDER_WIREFRAMEPASS

#include <stdint.h>
#include <stdbool.h>

#include "../geom/box.h"
#include "../geom/octoTree.h"
#include "../geom/octoTreeGrid.h"
#include "../geom/vertexElementBatch.h"

typedef struct WireframePass WireframePass;

struct WireframePass
{
  VertexElementBatch base;
  VecP mvp[16];
};

void WireframePass_pushBox(WireframePass *wireframe, Box box, Vec4 color);
void WireframePass_pushOctoTree(WireframePass *this, OctoTree *tree, Vec4 color, float colorTransform);
void WireframePass_pushOctoTreeGrid(WireframePass *this, OctoTreeGrid *grid, Vec4 color, float colorTranform);

#endif