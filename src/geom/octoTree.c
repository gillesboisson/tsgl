#include <math.h>
#include <stdio.h>
#include <emscripten.h>
#include "geom.h"
#include "octoTree.h"

OctoTree *OctoTree_create(Box bounds, uint16_t maxLevel, uint16_t maxElements, OctoTree *parent)
{
  OctoTree *out = malloc(sizeof(OctoTree));
  OctoTree_init(out, bounds, maxLevel, maxElements, parent);
  return out;
}

OctoTree *OctoTree_init(OctoTree *tree, Box bounds, uint16_t maxLevel, uint16_t maxElements, OctoTree *parent)
{
  // printf("OctoTree_init %i %i\n", maxLevel, maxElements);
  PtrBuffer_init(&tree->elements);
  Box_copy(tree->bounds, bounds);
  tree->maxLevel = maxLevel;
  tree->maxElements = maxElements;
  tree->parent = parent;
  tree->children = NULL;
  return tree;
}

void OctoTree_dispose(OctoTree *tree)
{
  if (tree->children != NULL)
  {
    for (size_t i = 0; i < 8; i++)
    {
      OctoTree_dispose(tree->children + i);
      free(tree->children);
    }
  }
  PtrBuffer_destroy(&tree->elements);
}

void OctoTree_destroy(OctoTree *tree)
{
  OctoTree_dispose(tree);
  free(tree);
}

void OctoTree_releaseChildren(OctoTree *tree)
{
  for (size_t i = 0; i < 8; i++)
  {
    OctoTree_dispose(tree->children + i);
  }
  free(tree->children);
  tree->children = NULL;
}

void OctoTree_createChildren(OctoTree *tree)
{
  tree->children = malloc(8 * sizeof(OctoTree));

  VecP halfSize[] = {
      (tree->bounds[1] - tree->bounds[0]) / 2,
      (tree->bounds[3] - tree->bounds[2]) / 2,
      (tree->bounds[5] - tree->bounds[4]) / 2,
  };

  for (uint16_t i = 0; i < 8; i++)
  {
    // VecP a = floor(i / 2) % 2;
    VecP offsetX = i % 2 * halfSize[0];
    VecP offsetY = (uint16_t)floor(i / 2) % 2 * halfSize[1];
    VecP offsetZ = (uint16_t)floor(i / 4) % 2 * halfSize[2];

    VecP childBounds[] = {
        offsetX,
        offsetX + halfSize[0],
        offsetY,
        offsetY + halfSize[1],
        offsetZ,
        offsetZ + halfSize[2],
    };

    OctoTree *child = OctoTree_init(tree->children + i, childBounds, tree->maxLevel - 1, tree->maxElements, tree);

    for (size_t f = 0; f < tree->elements.length; f++)
    {
      OctoTree_addNode(child, tree->elements.buffer[f], true);
    }
  }
}

void OctoTree_addNode(OctoTree *tree, SceneNode *node, bool doIntersectCheck)
{
  // check for double && do intersect check || real box intersection betwwen node and bounds
  if (PtrBuffer_indexOf(&tree->elements, node) == -1 && !doIntersectCheck ||
      !Box_interesects(node->bounds, tree->bounds))
    return;

  // add node
  PtrBuffer_push(&tree->elements, node);
  // printf("OctoTree_addNode tree->maxElements %i\n", tree->maxElements);
  // check if we need to create children / populate them
  if (tree->maxLevel > 0 && tree->elements.length >= tree->maxElements)
  {
    if (tree->children == NULL)
    {
      OctoTree_createChildren(tree);
    }
    else
    {
      for (size_t i = 0; i < 8; i++)
      {
        OctoTree_addNode(tree->children + i, node, true);
      }
    }
  }
}

void OctoTree_remodeNode(OctoTree *tree, SceneNode *node)
{
  if (PtrBuffer_remove(&tree->elements, (void *)node, false))
  {

    if (tree->children != NULL)
    {
      for (size_t i = 0; i < 8; i++)
      {
        OctoTree_remodeNode(tree->children + i, node);
      }

      if (tree->elements.length < tree->maxElements)
        OctoTree_releaseChildren(tree);
    }
  }
}

void OctoTree_frustrumCulling(PtrBuffer *out, OctoTree *tree, Frustrum *frustrum)
{
  enum CollisionType collision = Frustrum_intersectBox(frustrum, tree->bounds);
  if (collision != Outside)
  {
    if (collision == Inside || tree->children != NULL)
    {
      for (size_t i = 0; i < 8; i++)
      {
        OctoTree_frustrumCulling(out, tree->children + i, frustrum);
      }
    }
    else
    {
      for (size_t i = 0; i < tree->elements.length; i++)
      {
        PtrBuffer_pushMany(out, &tree->elements, true, true);
      }
    }
  }
}