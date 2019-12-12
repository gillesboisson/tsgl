
#ifndef HELPERS
#define HELPERS

#include "./glmatrix/glmatrix.h"

class MyClass{
    public:
    VecP x;
    VecP y;
    VecP z;


    void sayHello();
    bool set(VecP pX, VecP pY, VecP pZ);
};

#endif