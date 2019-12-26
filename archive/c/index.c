#include <stdio.h>
#include <math.h>
#include <stdlib.h>

#include <emscripten/emscripten.h>
#include "./glmatrix/glmatrix.h"
#include "./core/ptrBuffer.h"
#include "geom/tests.h"
#include "geom/transform.h"
#include "geom/sceneNode.h"
#include "geom/octoTree.h"
#include "core/test.h"

//#include "./myClass.h"

#ifdef __cplusplus
extern "C"
{
#endif

  EMSCRIPTEN_KEEPALIVE void runTests()
  {
    printf("Run tests\n");
    Geom_testBoxes();
    // Objpool_tests();
    // BufferStack_tests();
  }

  typedef enum
  {
    MY_FIRST_FLAG = 1,
    MY_SEC_FLAG = 2,
    MY_THIRD_FLAG = 4,
  } EnumTest;

  typedef struct
  {
    EnumTest myEnum;
    float myFloat;
    double myDouble;
  } TestEnum;

  EMSCRIPTEN_KEEPALIVE void test_buffer(TestEnum *testEnum)
  {
  }

  EMSCRIPTEN_KEEPALIVE void MyEnumClass_print(TestEnum *testEnum)
  {
    printf("testEnum %i %f %f\n", testEnum->myEnum, testEnum->myFloat, testEnum->myDouble);
  };

  EMSCRIPTEN_KEEPALIVE void MyEnumClass_attr(TestEnum *testEnum)
  {
    testEnum->myEnum = MY_FIRST_FLAG | MY_THIRD_FLAG;
    testEnum->myFloat = 4.4;
    testEnum->myDouble = 8.8;

    MyEnumClass_print(testEnum);
  };

  EMSCRIPTEN_KEEPALIVE struct PtrBuffer *TestPtrB(struct PtrBuffer *bufferc)
  {
    //struct PtrBuffer* buffer = PtrBuffer_create();
    struct PtrBuffer *buffer = bufferc;

    for (int i = 0; i < 32; i++)
    {

      uint32_t b = (uint32_t)buffer->buffer;
      uint32_t bl = (uint32_t)buffer->bufferLength;

      Vec3 vec = Vec3_create();

      vec[0] = i * 1.0;
      vec[1] = i * 10000.0;
      vec[2] = i * 100000000.0;

      PtrBuffer_push(buffer, vec);
    }

    for (int i = 0; i < 16; i++)
    {
      PtrBuffer_remove(buffer, buffer->buffer[0], true);
    }

    printf("length %d\n", buffer->length);

    return buffer;
  }


#ifdef __cplusplus
}
#endif
