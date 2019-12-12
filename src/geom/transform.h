#ifndef GEOMTRANSFORM
#define GEOMTRANSFORM

#include <stdbool.h>
#include "../glmatrix/glmatrix.h"
#include "../core/ptrBuffer.h"



typedef enum{
    DIRTY_NONE = 0x00,
    DIRTY_LOCAL = 0x01,
    DIRTY_GLOBAL = 0X02,
    DIRTY_BOUNDS = 0X04,
    DIRTY_ALL= 0XFF,
} DirtyFlag;

typedef struct{
    unsigned int dirty;
    //bool localDirty;
    //bool dirty;
    VecP position[3];
    VecP scale[3];
    VecP rotation[4];
    VecP localMat[16];
    VecP rotMat[16];
    VecP worldMat[16];
    PtrBuffer children;
} Transform;


//void Transform_addChild(Transform* tr, Transform* child);
Transform* Transform_create();
Mat4 Transform_getLocalMat(Transform* tr);
void Transform_init(Transform* transform);
//void Transform_removeChild(Transform* tr, Transform* child);
void Transform_rotateAroundAxes(Transform* tr, Vec3 axe,VecP angle);
void Transform_rotateEuler(Transform* tr, VecP x,VecP y,VecP z);
void Transform_setEulerRotation(Transform* tr, VecP x,VecP y,VecP z);
void Transform_setPosition(Transform* tr, VecP x,VecP y,VecP z);
void Transform_setRotationEuler(Transform* tr, VecP x,VecP y,VecP z);
void Transform_setScale(Transform* tr, VecP x,VecP y,VecP z);
void Transform_translate(Transform* tr, VecP x,VecP y,VecP z);
void Transform_updateLocalMat(Transform* tr);
void Transform_updateWorldMat(Transform* tr, Mat4 parentMat, bool parentWasDirty);
Mat4 TranslateScaleRotateQuat(Mat4 out,Vec3 scale,Quat rotQuat, Vec3 position,Mat4 rotMat);
void Transform_print(Transform* tr, bool debugChildren);



#endif