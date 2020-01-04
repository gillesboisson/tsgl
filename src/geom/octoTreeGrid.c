#include <math.h>
#include <stdio.h>
#include <emscripten.h>
#include "geom.h"
#include "octoTreeGrid.h"

EMSCRIPTEN_KEEPALIVE OctoTreeGrid *OctoTreeGrid_create(VecP x, VecP y, VecP z, VecP baseBoxWidth, VecP baseBoxHeight, VecP baseBoxDepth, uint32_t nbBoxX, uint32_t nbBoxY, uint32_t nbBoxZ, uint16_t maxLevel, uint16_t maxElements)
{
  OctoTreeGrid *out = malloc(sizeof(OctoTreeGrid));
  OctoTreeGrid_init(out, x, y, z, baseBoxWidth, baseBoxHeight, baseBoxDepth, nbBoxX, nbBoxY, nbBoxZ, maxLevel, maxElements);
  return out;
}

Box OctoTreeGrid_getBounds(Box out, OctoTreeGrid *this)
{
  out[0] = this->x;
  out[1] = this->x + this->nbBoxX * this->baseBoxWidth;
  out[2] = this->y;
  out[3] = this->y + this->nbBoxY * this->baseBoxHeight;
  out[4] = this->z;
  out[5] = this->z + this->nbBoxZ * this->baseBoxDepth;

  return out;
}

void OctoTreeGrid_init(OctoTreeGrid *grid, VecP x, VecP y, VecP z, VecP baseBoxWidth, VecP baseBoxHeight, VecP baseBoxDepth, uint32_t nbBoxX, uint32_t nbBoxY, uint32_t nbBoxZ, uint16_t maxLevel, uint16_t maxElements)
{
  grid->x = x;
  grid->y = y;
  grid->z = z;
  grid->baseBoxWidth = baseBoxWidth;
  grid->baseBoxHeight = baseBoxHeight;
  grid->baseBoxDepth = baseBoxDepth;
  grid->nbBoxX = nbBoxX;
  grid->nbBoxY = nbBoxY;
  grid->nbBoxZ = nbBoxZ;
  grid->maxLevel = maxLevel;
  grid->maxElements = maxElements;
  size_t nbTrees = nbBoxX * nbBoxY * nbBoxZ;
  grid->trees = malloc(nbTrees * sizeof(OctoTree));
  size_t nbBoxYZ = nbBoxY * nbBoxZ;
  VecP bounds[6];

  for (size_t i = 0; i < nbBoxX; i++)
  {
    for (size_t f = 0; f < nbBoxY; f++)
    {
      for (size_t g = 0; g < nbBoxZ; g++)
      {
        size_t ind = nbBoxYZ * i + f * nbBoxZ + g;

        Box_setPosSize(bounds, i * baseBoxWidth + x, f * baseBoxHeight + y, g * baseBoxDepth + z, baseBoxWidth, baseBoxHeight, baseBoxDepth);
        OctoTree_init(grid->trees + ind, bounds, maxLevel, maxElements, NULL);
      }
    }
  }
}

OctoTree **OctoTreeGrid_treesInBounds(uint32_t *nbTrees, OctoTreeGrid *grid, Box bounds)
{

  VecP globalBounds[6];
  Box_setIntersection(globalBounds, OctoTreeGrid_getBounds(globalBounds, grid), bounds);

  uint32_t minX = floor(globalBounds[0] / grid->baseBoxWidth);
  uint32_t maxX = ceil(globalBounds[1] / grid->baseBoxWidth);
  uint32_t minY = floor(globalBounds[2] / grid->baseBoxHeight);
  uint32_t maxY = ceil(globalBounds[3] / grid->baseBoxHeight);
  uint32_t minZ = floor(globalBounds[4] / grid->baseBoxDepth);
  uint32_t maxZ = ceil(globalBounds[5] / grid->baseBoxDepth);

  // printf("OctoTreeGrid_treesInBounds > minX %i, maxX %i, minY %i, maxY %i, minZ %i , maxZ %i\n", minX, maxX, minY, maxY, minZ, maxZ);

  size_t nbBoxYZ = grid->nbBoxY * grid->nbBoxZ;
  size_t ind;
  *nbTrees = (maxZ - minZ) * (maxY - minY) * (maxX - minX);

  OctoTree **trees = malloc(*nbTrees * sizeof(OctoTree *));
  OctoTree **treesIt = trees;

  for (size_t x = minX; x < maxX; x++)
  {
    for (size_t y = minY; y < maxY; y++)
    {
      for (size_t z = minZ; z < maxZ; z++)
      {
        ind = nbBoxYZ * x + y * grid->nbBoxZ + z;
        *treesIt = grid->trees + ind;

        // printf("Add grid at %zu, %zu, %zu, ind %zu, ptr %i , tree ptr %i \n", x, y, z, ind, treesIt, *treesIt);

        treesIt++;
      }
    }
  }

  return trees;
}
void OctoTreeGrid_frustrumCulling(PtrBuffer *out, OctoTreeGrid *grid, Frustrum *frustrum)
{
  Box bounds = Frustrum_bounds(frustrum);
  uint32_t nbTrees;
  OctoTree **trees = OctoTreeGrid_treesInBounds(&nbTrees, grid, bounds);
  for (size_t i = 0; i < nbTrees; i++)
  {
    OctoTree_frustrumCulling(out, trees[i], frustrum);
  }

  free(trees);
}

void OctoTreeGrid_destroy(OctoTreeGrid *grid)
{
  OctoTreeGrid_dispose(grid);
  free(grid);
}

void OctoTreeGrid_dispose(OctoTreeGrid *grid)
{
  size_t nbBoxXYZ = grid->nbBoxX * grid->nbBoxY * grid->nbBoxZ;
  for (size_t i = 0; i < nbBoxXYZ; i++)
  {
    OctoTree_dispose(grid->trees + i);
  }
  free(grid->trees);
}