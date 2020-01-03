#ifndef RENDER_QUEUEPASS
#define RENDER_QUEUEPASS

#include <stdint.h>
#include <stdbool.h>
#include "renderPass.h"

typedef struct QueuePass QueuePass;

struct QueuePass
{
  RenderPass basePass;
  uint32_t length;
  uint32_t index;
};

inline void QueuePass_begin(QueuePass *pass)
{
  pass->index = 0;
}

inline void QueuePass_apply(QueuePass *pass)
{
  (pass->basePass.applyFunction)(&pass->basePass);
  pass->index = 0;
}

inline void QueuePass_end(QueuePass *pass)
{
  if (pass->index > 0)
    QueuePass_apply(pass);
}

void QueuePass_print(QueuePass *this);

void QueuePass_init(QueuePass *this, uint32_t length, void (*bindFunction)(RenderPass *rp), void (*applyFunction)(RenderPass *rp));

#endif