#ifndef FRUSTRUM_GEOM
#define FRUSTRUM_GEOM

#include "plane.h"
#include "box.h"

struct Frustrum
{
  bool dirtyBounds;
  VecP planes[6][4];
  VecP invertMat[16];
  VecP bounds[6];
};

typedef struct Frustrum Frustrum;

Box Frustrum_bounds(Frustrum *source);
bool Frustrum_containsVec(Frustrum *source, Vec3 vec);
Frustrum *Frustrum_create();
enum CollisionType Frustrum_intersectBounds(Frustrum *source, Box rect);
void Frustrum_setFromMat(Frustrum *out, Mat4 me);

#endif