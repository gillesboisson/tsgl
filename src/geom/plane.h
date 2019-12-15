#ifndef PLANE_GEOM
#define PLANE_GEOM

#include "geom.h"
#include "box.h"

// Plane
Plane Plane_applyMat4(Plane out, Mat4 mat);
Vec3 Plane_coplanarVec(Vec3 outVec, Plane source);
Plane Plane_copy(Plane out, Plane p);
Plane Plane_create();
VecP Plane_distanceToVec(Plane source, Vec3 vec);
bool Plane_equals(Plane p1, Plane p2);
Plane Plane_fromValue(VecP x, VecP y, VecP z, VecP w);
Plane Plane_fromVecWeight(Vec3 v, VecP w);
Plane Plane_intersectLine(Plane out, Plane sourcePlane, Vec3 lineVec1, Vec3 lineVec2);
bool Plane_intersectsBox(Plane source, Box box);
bool Plane_intersectsLine(Plane sourcePlane, Vec3 lineVec1, Vec3 lineVec2);
Plane Plane_negate(Plane out);
Plane Plane_normalize(Plane out);
Plane Plane_projectVec(Plane out, Plane sourcePlane, Vec3 vec);
Plane Plane_set(Plane out, VecP x, VecP y, VecP z, VecP w);
Plane Plane_translate(Plane out, Vec3 v);

#endif