#include "multiStruct.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>
#include "emscripten.h"
#include <stdio.h>


void SubStruct_init(SubStruct* str){
    str->a = 0;
    str->b = 0;
}

TestStruct* TestStruct_create(){
    TestStruct* str = (TestStruct*)malloc(sizeof(TestStruct));
    return str;
}

void TestStruct_init(TestStruct* str){
    str->aa = 0;
    str->bb = 0;
    SubStruct_init(&str->ss);
}

#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE void TestStruct_print(TestStruct* str){
    printf("TestStruct %f %f\n",str->aa, str->bb);
}

#ifdef __cplusplus
}
#endif

