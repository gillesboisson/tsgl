
#ifndef BOX_GEOM
#define BOX_GEOM

#include "stdint.h"
#include "geom.h"
#include "helpers.h"
#include "plane.h"
#include "vertexElementBatch.h"

// Box
Box Box_addMargin(Box out, VecP marginX, VecP marginY, VecP marginZ);
Box Box_applyMat(Box out, Box source, Mat4 mat);
Box Box_clean(Box out);
Box Box_clone(Box source);
bool Box_contains(Box box1, Box box2);
bool Box_containsVec(Box box, Vec3 vec);
Box Box_copy(Box out, Box source);
Vec3 Box_copyCenter(Vec3 outVec, Box source);
Box Box_copySize(Vec3 outVec, Box source);
Box Box_create();
Box Box_expand(Box out, VecP x, VecP y, VecP z);
Box Box_fromCenterSize(Vec3 centerVec, Vec3 sizeVec);
Box Box_fromValues(VecP minX, VecP maxX, VecP minY, VecP maxY, VecP minZ, VecP maxZ);
Box Box_fromVecs(Vec3 min, Vec3 max);
bool Box_interesects(Box box1, Box box2);
bool Box_interesectsIn(Box box1, Box box2);
bool Box_intersectPlane(Box source, Plane sPlane);
Box Box_merge(Box out, Box box1, Box box2);
Box Box_setIntersection(Box out, Box box1, Box box2);
Box Box_move(Box out, Vec3 v);
void Box_reset(Box out);
Box Box_set(Box out, VecP minX, VecP maxX, VecP minY, VecP maxY, VecP minZ, VecP maxZ);
Box Box_setCenterSize(Box out, Vec3 centerVec, Vec3 sizeVec);

void Box_getSize(Vec3 out, Box box);
Box Box_setPosSize(Box out, VecP x, VecP y, VecP z, VecP width, VecP height, VecP depth);

Box Box_setFromVertices(Box out, VecP *vertices, size_t nbVertices, size_t stride, size_t offset, Mat4 mat);
Box Box_setFromPoints(Box out, VecP *vertices, int nbPoints, Mat4 mat);

Box Box_setSize(Box out, VecP width, VecP height, VecP depth);
Box Box_setSizeFromVec3(Box out, Vec3 vec);
Box Box_toVertices(Box out, Box source);
void Box_updateScalePos(Vec3 outPos, Vec3 outScale, Box source);
void Box_print(Box source);

// void Box_wireframeDebug(Box box, Vec4 color, VertexElementBatch *vertexBatch);

typedef VecP *Box;

#endif