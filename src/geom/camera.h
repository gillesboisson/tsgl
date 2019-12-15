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
  VecP perspectiveMat[16];
  bool isOrtho;
} Camera;

void Camera_mvp(Mat4 out, Camera *source, Mat4 modelMat);
void Camera_mvpStack(BufferStack *outBf, Camera *source, BufferStack *modelMatBf);

#endif
