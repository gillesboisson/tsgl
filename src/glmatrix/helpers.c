#include "./glmatrix.h"
#include <math.h>
#include <stdlib.h>
#include <stdbool.h>

VecP min(VecP a, VecP b){
    return a < b ? a : b;
}

VecP max(VecP a, VecP b){
    return a > b ? a : b;
}
