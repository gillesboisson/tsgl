
#ifndef GLMATH
#define GLMATH
#include "../glmatrix/glmatrix.h"

enum CollisionType{
    Outside = 0,
    Inside = 1,
    Intersect = 2,
};

typedef VecP* Plane;
typedef VecP* Box;

// Plane
Plane Plane_applyMat4(Plane out, Mat4 mat);
Vec3 Plane_coplanarVec(Vec3 outVec,Plane source);
Plane Plane_copy(Plane out, Plane p);
Plane Plane_create();
VecP Plane_distanceToVec(Plane source,Vec3 vec);
bool Plane_equals(Plane p1, Plane p2);
Plane Plane_fromValue(VecP x,VecP y,VecP z,VecP w);
Plane Plane_fromVecWeight(Vec3 v,VecP w);
Plane Plane_intersectLine(Plane out,Plane sourcePlane,Vec3 lineVec1,Vec3 lineVec2);
bool Plane_intersectsBox(Plane source, Box box);
bool Plane_intersectsLine(Plane sourcePlane,Vec3 lineVec1,Vec3 lineVec2);
Plane Plane_negate(Plane out);
Plane Plane_normalize(Plane out);
Plane Plane_projectVec(Plane out,Plane sourcePlane,Vec3 vec);
Plane Plane_set(Plane out, VecP x,VecP y,VecP z,VecP w);
Plane Plane_translate(Plane out, Vec3 v);



// Box
Box Box_addMargin(Box out,VecP marginX,VecP marginY,VecP marginZ);
Box Box_applyMat(Box out, Box source, Mat4 mat);
Box Box_clean(Box out);
Box Box_clone(Box source);
bool Box_contains(Box box1,Box box2);
bool Box_containsVec(Box box, Vec3 vec);
Box Box_copy(Box out, Box source);
Vec3 Box_copyCenter(Vec3 outVec, Box source);
Box Box_copySize(Vec3 outVec, Box source);
Box Box_create();
Box Box_expand(Box out,VecP x,VecP y,VecP z);
Box Box_fromCenterSize(Vec3 centerVec, Vec3 sizeVec);
Box Box_fromValues(VecP minX,VecP maxX,VecP minY,VecP maxY,VecP minZ,VecP maxZ);
Box Box_fromVecs(Vec3 min, Vec3 max);
bool Box_interesects(Box box1,Box box2);
bool Box_interesectsIn(Box box1, Box box2);
bool Box_intersectPlane(Box source,Plane sPlane);
Box Box_merge(Box out,Box box1,Box box2);
Box Box_move(Box out,Vec3 v);
void Box_reset(Box out);
Box Box_set(Box out,VecP minX,VecP maxX,VecP minY,VecP maxY,VecP minZ,VecP maxZ);
Box Box_setCenterSize(Box out, Vec3 centerVec, Vec3 sizeVec);
Box Box_setFromVertices(Box out,VecP* vertices, int verticesLength,Mat4 mat);
Box Box_setSize(Box out,VecP width,VecP height,VecP depth);
Box Box_setSizeFromVec3(Box out, Vec3 vec);
Box Box_toVertices(Box out, Box source);
void Box_updateScalePos(Vec3 outPos,Vec3 outScale,Box source);
void Box_print(Box source);

struct Frustrum{
    bool dirtyBounds;
    VecP planes[6][4];
    VecP invertMat[16];
    VecP bounds[6];
};

typedef struct Frustrum Frustrum; 

Box Frustrum_bounds(Frustrum* source);
bool Frustrum_containsVec(Frustrum* source, Vec3 vec);
Frustrum* Frustrum_create();
enum CollisionType Frustrum_intersectBounds(Frustrum* source, Box rect);
void Frustrum_setFromMat(Frustrum* out, Mat4 me);

#endif