
#ifndef OCTO_TREE_GEOM
#define OCTO_TREE_GEOM
#include <stdint.h>
#include <stdbool.h>
#include "../core/ptrBuffer.h"

#include "geom.h"
#include "plane.h"
#include "sceneNode.h"
#include "frustrum.h"

typedef struct OctoTree OctoTree;

struct OctoTree
{
  VecP bounds[6];
  PtrBuffer elements;
  uint16_t maxLevel;
  uint16_t maxElements;
  OctoTree *parent;
  OctoTree *children;
};

// void OctoTree_createChildren(OctoTree *tree);

OctoTree *OctoTree_create(Box bounds, uint16_t maxLevel, uint16_t maxElements, OctoTree *parent);
OctoTree *OctoTree_init(OctoTree *tree, Box bounds, uint16_t maxLevel, uint16_t maxElements, OctoTree *parent);
void OctoTree_dispose(OctoTree *tree);
void OctoTree_destroy(OctoTree *tree);
// void OctoTree_releaseChildren(OctoTree *tree);
// void OctoTree_createChildren(OctoTree *tree);
void OctoTree_addNode(OctoTree *tree, SceneNode *node, bool doIntersectCheck);
void OctoTree_remodeNode(OctoTree *tree, SceneNode *node);
void OctoTree_frustrumCulling(PtrBuffer *out, OctoTree *tree, Frustrum *frustrum);

#endif
