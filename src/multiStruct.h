
#ifndef SUBSTRUCT
#define SUBSTRUCT
struct SubStruct{
    float a;
    float b;
};
typedef struct SubStruct SubStruct;

struct TestStruct{
    float aa;
    SubStruct ss;
    float bb;
};
typedef struct TestStruct TestStruct;




void SubStruct_init(SubStruct* str);

TestStruct* TestStruct_create();

void TestStruct_init(TestStruct* str);

#endif