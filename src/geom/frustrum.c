#include "frustrum.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>

VecP __v1[3];
VecP __v2[3];


VecP _vmax[3];
VecP _vmin[3];



const VecP _boxVertices[8][4] = {
    {-1.0,-1.0,1.0,1.0},
    {1.0,-1.0,1.0,1.0},
    {1.0,1.0,1.0,1.0},
    {-1.0,1.0,1.0,1.0},
    {-1.0,-1.0,-1.0,1.0},
    {1.0,-1.0,-1.0,1.0},
    {1.0,1.0,-1.0,1.0},
    {-1.0,1.0,-1.0,1.0},
};

Frustrum* Frustrum_create(){
    Frustrum* out = malloc(sizeof(Frustrum));
    Box_reset(out->bounds);
    Mat4_identity(out->invertMat);
    out->dirtyBounds = true;
    return out;
}


void Frustrum_setFromMat(Frustrum* out, Mat4 me){

    Plane_normalize(Plane_set(out->planes[0], me[3] - me[0], me[7] - me[4], me[11] - me[8], me[15] - me[12] ));
    Plane_normalize(Plane_set(out->planes[1], me[3] + me[0], me[7] + me[4], me[11] + me[8], me[15] + me[12] ));
    Plane_normalize(Plane_set(out->planes[2], me[3] + me[1], me[7] + me[5], me[11] + me[9], me[15] + me[13] ));
    Plane_normalize(Plane_set(out->planes[3], me[3] - me[1], me[7] - me[5], me[11] - me[9], me[15] - me[13] ));
    Plane_normalize(Plane_set(out->planes[4], me[3] - me[2], me[7] - me[6], me[11] - me[10], me[15] - me[14] ));
    Plane_normalize(Plane_set(out->planes[5], me[3] + me[2], me[7] + me[6], me[11] + me[10], me[15] + me[14] ));
    out->dirtyBounds = true;
    Mat4_invert(out->invertMat,me);
}



enum CollisionType Frustrum_intersectBounds(Frustrum* source, Box rect){



    enum CollisionType res = Inside;

    Plane plane;

    for(size_t i = 0; i < 6; i++) {

        if(source->planes[i][0] > 0) {
            _vmin[0] = rect[0];
            _vmax[0] = rect[1];
        } else {
            _vmin[0] = rect[1];
            _vmax[0] = rect[0];
        }
        // Y axis
        if(source->planes[i][1] > 0) {
            _vmin[1] = rect[2];
            _vmax[1] = rect[3];
        } else {
            _vmin[1] = rect[3];
            _vmax[1] = rect[2];
        }

        if(source->planes[i][2] > 0) {
            _vmin[2] = rect[4];
            _vmax[2] = rect[5];
        } else {
            _vmin[2] = rect[5];
            _vmax[2] = rect[4];
        }



        if(Vec3_dot(source->planes[i],_vmax) + source->planes[i][3] >= 0){
            if(Vec3_dot(source->planes[i],_vmin) + source->planes[i][3] < 0)
            res = Intersect;
        }else
            return Outside;
        }

    return res;
}

bool Frustrum_containsVec(Frustrum* source, Vec3 vec) {


    for (size_t i = 0; i < 6; i ++ ) {
        if ( Plane_distanceToVec(source->planes[ i ],vec) < 0 ) {
            return false;
        }
    }

    return true;

}

const VecP _boundsVertices3[8][3];

Box Frustrum_bounds(Frustrum* source) {
    VecP v;
    VecP v4[4];
    if(source->dirtyBounds) {
        
        source->dirtyBounds = false;
        

        for (size_t i = 0; i < 8; i++) {
            //v = _boundsVertices4[i];
            Vec4_transformMat4(v4,(Vec4)_boxVertices[i], source->invertMat);
            Vec3_set((Vec3)_boundsVertices3[i],
                v4[0] / v4[3],
                v4[1] / v4[3],
                v4[2] / v4[3]
            );


        }

        Box_setFromVertices(source->bounds,(VecP*) &_boundsVertices3,8,NULL);

    }

    return source->bounds;
}