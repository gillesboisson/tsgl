#ifndef RENDER_RENDERPASS
#define RENDER_RENDERPASS

#include <stdint.h>
#include <stdbool.h>
#include "../core/ptrBuffer.h"

typedef struct RenderPass RenderPass;
typedef struct QueuePass QueuePass;

struct RenderPass
{
  void (*bindFunction)(RenderPass *rp);
  void (*applyFunction)(RenderPass *rp);
};

struct QueuePass
{
  RenderPass basePass;
  uint32_t length;
  uint32_t index;
};

inline void RenderPass_init(RenderPass *rp, void (*bindFunction)(RenderPass *rp), void (*applyFunction)(RenderPass *rp))
{
  rp->bindFunction = bindFunction;
  rp->applyFunction = applyFunction;
}

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

void RenderPass_wasmInit(RenderPass *rp);

void QueuePass_print(QueuePass *this);
#endif