#ifndef RENDER_RENDERPASS
#define RENDER_RENDERPASS

#include <stdint.h>
#include <stdbool.h>
#include "../core/ptrBuffer.h"

typedef struct RenderPass RenderPass;

struct RenderPass
{
  void (*bindFunction)(RenderPass *rp);
  void (*applyFunction)(RenderPass *rp);
};

inline void RenderPass_init(RenderPass *rp, void (*bindFunction)(RenderPass *rp), void (*applyFunction)(RenderPass *rp))
{
  rp->bindFunction = bindFunction;
  rp->applyFunction = applyFunction;
}

void RenderPass_wasmInit(RenderPass *rp);

#endif