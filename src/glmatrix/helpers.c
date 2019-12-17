#include "./glmatrix.h"
#include <math.h>
#include <stdio.h>

VecP min(VecP a, VecP b)
{
  return a < b ? a : b;
}

VecP max(VecP a, VecP b)
{
  return a > b ? a : b;
}

void glmatrix_printMat(VecP *mat, size_t cols, size_t rows)
{
  printf("[\n");
  for (size_t i = 0; i < rows; i++)
  {
    for (size_t f = 0; f < cols; f++)
    {
      if (f > 0)
        printf(",");
      printf("%f", mat[f + i * cols]);
    }
    printf("\n");
  }
  printf("]\n");
}