#include "geom.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>


Plane Plane_create(){
    Plane out = malloc(sizeof(VecP)* 4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
}

Plane Plane_fromValue(VecP x,VecP y,VecP z,VecP w){
    Plane out = malloc(sizeof(VecP)* 4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[2] = w;
    return out;
}

Plane Plane_fromVecWeight(Vec3 v,VecP w){
    Plane out = malloc(sizeof(VecP)* 4);
    out[0] = v[0];
    out[1] = v[1];
    out[2] = v[2];
    out[2] = w;
    return out;
}

Plane Plane_set(Plane out, VecP x,VecP y,VecP z,VecP w){
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[2] = w;
    return out;
}

Plane Plane_copy(Plane out, Plane p){
    out[0] = p[0];
    out[1] = p[1];
    out[2] = p[2];
    out[2] = p[2];
    return out;
}

Plane Plane_normalize(Plane out){

    VecP inverseNormalLength = 1.0 / Vec4_length(out);

    out[0] *= inverseNormalLength;
    out[1] *= inverseNormalLength;
    out[2] *= inverseNormalLength;
    out[3] *= inverseNormalLength;

    return out;
}

Plane Plane_negate(Plane out){

    VecP inverseNormalLength = 1.0 / Vec4_length(out);

    out[0] *= -1;
    out[1] *= -1;
    out[2] *= -1;
    out[2] *= -1;

    return out;
}

VecP Plane_distanceToVec(Plane source,Vec3 vec){
    return Vec3_dot(source,vec) + source[3];
}

Plane Plane_projectVec(Plane out,Plane sourcePlane,Vec3 vec){

    Vec3_copy(out,sourcePlane);
    Vec3_scale(out,out,Plane_distanceToVec(sourcePlane,vec));
    Vec3_add(out,out,vec);

    return out;

}


Vec3 Plane_coplanarVec (Vec3 outVec,Plane source) {

      Vec3_copy(outVec,source);
      Vec3_scale(outVec,outVec,-source[3]);
      return outVec;
};

VecP _tp_mat[9];
VecP _tp_v1[3];

Plane Plane_applyMat4(Plane out, Mat4 mat){
    Mat3_normalFromMat4(_tp_mat,mat);
    Plane_coplanarVec(_tp_v1,out);
    Vec3_transformMat4(_tp_v1,_tp_v1,mat);
    Vec3_transformMat3(out,out,_tp_mat);
    Vec3_normalize(out,out);
    out[3] = -Vec3_dot(_tp_v1,out);
    return out;
}

Plane Plane_translate(Plane out, Vec3 v){
    out[3] -= Vec3_dot(v, out);
    return out;
}

bool Plane_equals(Plane p1, Plane p2){
    return 
    p1[0] == p2[0] 
    && p1[1] == p2[1] 
    && p1[2] == p2[2] 
    && p1[3] == p2[3]; 
}

bool Plane_intersectsBox(Plane source, Box box){
    // TODO: implement
    return false;
}

// TODO:implement
Plane Plane_intersectLine(Plane out,Plane sourcePlane,Vec3 lineVec1,Vec3 lineVec2){
     return NULL;
}

// TODO:implement
bool Plane_intersectsLine(Plane sourcePlane,Vec3 lineVec1,Vec3 lineVec2){
     return false;
}