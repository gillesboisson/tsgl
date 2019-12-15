
#ifndef GEOM
#define GEOM

#include "../glmatrix/glmatrix.h"

enum CollisionType
{
  Outside = 0,
  Inside = 1,
  Intersect = 2,
};

typedef VecP *Box;
typedef VecP *Plane;

#endif