
#ifndef OCTO_TREE_GRID_GEOM
#define OCTO_TREE_GRID_GEOM

#include <stdint.h>
#include <stdbool.h>
#include "../core/ptrBuffer.h"

#include "octoTree.h"

typedef struct
{
  VecP x;
  VecP y;
  VecP z;
  VecP baseBoxWidth;
  VecP baseBoxHeight;
  VecP baseBoxDepth;
  uint32_t nbBoxX;
  uint32_t nbBoxY;
  uint32_t nbBoxZ;
  OctoTree *trees;
  uint16_t maxLevel;
  uint16_t maxElements;
} OctoTreeGrid;

OctoTreeGrid *OctoTreeGrid_create(VecP x, VecP y, VecP z, VecP baseBoxWidth, VecP baseBoxHeight, VecP baseBoxDepth, uint32_t nbBoxX, uint32_t nbBoxY, uint32_t nbBoxZ, uint16_t maxLevel, uint16_t maxElements);
void OctoTreeGrid_init(OctoTreeGrid *grid, VecP x, VecP y, VecP z, VecP baseBoxWidth, VecP baseBoxHeight, VecP baseBoxDepth, uint32_t nbBoxX, uint32_t nbBoxY, uint32_t nbBoxZ, uint16_t maxLevel, uint16_t maxElements);
void OctoTreeGrid_destroy(OctoTreeGrid *grid);
void OctoTreeGrid_dispose(OctoTreeGrid *grid);
OctoTree **OctoTreeGrid_treesInBounds(uint32_t *nbTrees, OctoTreeGrid *grid, Box bounds);
void OctoTreeGrid_frustrumCulling(PtrBuffer *out, OctoTreeGrid *grid, Frustrum *frustrum);

inline OctoTree *treeAt(OctoTreeGrid *grid, uint32_t x, uint32_t y, uint32_t z)
{
  return grid->trees + x * grid->nbBoxY * grid->nbBoxZ + y * grid->nbBoxZ + x;
}

// inline uint32_t OctoTreeGrid_nbTreesInBounds(OctoTreeGrid *grid, Box bounds)
// {
//   return ceil(bounds[1] / grid->baseBoxWidth) - floor(bounds[0] / grid->baseBoxWidth) * ceil(bounds[3] / grid->baseBoxHeight) - floor(bounds[2] / grid->baseBoxHeight) * ceil(bounds[5] / grid->baseBoxDepth) - floor(bounds[4] / grid->baseBoxDepth);
// }

#endif