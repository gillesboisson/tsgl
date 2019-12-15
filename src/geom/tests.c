#include "geom.h"
#include "box.h"
#include "plane.h"
#include "tests.h"
#include <math.h>
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>

void Geom_testBoxes()
{
  VecP vP[] = {0, 0, 0};
  VecP vS[] = {10, 10, 10};
  Box box = Box_create();
  Box box2 = Box_create();

  Box_setCenterSize(box, vP, vS);
  Box_print(box);

  VecP moveV[] = {-4.9, -4.9, -4.9};

  Box_set(box2, 10, 20, 10, 20, 10, 20);

  Box_print(box2);
  Box_move(box2, moveV);

  Box_print(box2);

  bool touch = Box_interesects(box, box2);

  if (touch == true)
  {
    printf("Failed no intersection expected %i\n", touch);
  }

  Vec3_set(moveV, -5, -5, -5);

  touch = Box_interesects(box, box2);

  if (touch == false)
  {
    printf("Failed intersection expected %i\n", touch);
  }

  VecP points[] = {
      -3,
      -7,
      -9,
      -3,
      -9,
      -2,
      -9,
      -7,
      -1,
      3,
      7,
      11,
      3,
      11,
      2,
      11,
      7,
      1,
  };

  Box_setFromVertices(box, points, 6, NULL);

  printf("Box after vertices \n");
  Box_print(box);

  if (box[0] != -9.0 || box[2] != -9.0 || box[4] != -9.0 || box[1] != 11.0 || box[3] != 11.0 || box[5] != 11.0)
  {
    printf("Failed final not matched \n");
  }
}