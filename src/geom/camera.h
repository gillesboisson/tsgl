#ifndef CAMERA_GEOM
#define CAMERA_GEOM

#include "geom.h"
#include "sceneNode.h"
#include "frustrum.h"
#include "../core/bufferStack.h"

typedef struct
{
  SceneNode node;
  Frustrum frustrum;
  VecP projectionMat[16];
  VecP viewProjectionMat[16];
  bool isOrtho;
} Camera;

inline void Camera_mvp(Camera *source, Mat4 out, Mat4 modelMat)
{
  Mat4_multiply(source->viewProjectionMat, source->projectionMat, source->node.worldMat);
  Mat4_multiply(out, source->viewProjectionMat, modelMat);

  // printf("projection\n");
  // glmatrix_printMat(source->projectionMat, 4, 4);
  // printf("cam worldMat\n");
  // glmatrix_printMat(source->node.worldMat, 4, 4);
  // printf("model world mat\n");
  // glmatrix_printMat(modelMat, 4, 4);
  // printf("result\n");
  // glmatrix_printMat(out, 4, 4);
}

inline void Camera_mv(Camera *source, Mat4 out, Mat4 modelMat)
{
  Mat4_multiply(out, source->node.worldMat, modelMat);
}

//void Camera_mvpStack(BufferStack *outBf, Camera *source, BufferStack *modelMatBf);
//void Camera_result(BufferStack *outBf, Camera *source, BufferStack *modelMatBf);

#endif
