import { DeferredFrameBuffer } from '../../app/DeferredFrameBuffer';
import { GLRenderer } from '../gl';
import { RenderPass3D } from './RenderPass3D';
import { SceneInstance3D } from '../utils/primitive/SceneInstance3D';

export interface DeferredPrepassOptions {
  width?: number;
  height?: number;
  emissiveEnabled: boolean;
}

export type DeferredPrepassSettings = Required<DeferredPrepassOptions>;

export function deferredSettingsFromOptions(
  renderer: GLRenderer,
  options: DeferredPrepassOptions,
): DeferredPrepassSettings {
  return {
    width: renderer.width,
    height: renderer.height,
    ...options,
  };
}

export class DeferredPrepass extends RenderPass3D implements DeferredPrepassSettings {
  readonly emissiveEnabled: boolean;

  get deferredFramebuffer(): DeferredFrameBuffer {
    return this.framebuffer as DeferredFrameBuffer;
  }

  constructor(renderer: GLRenderer, options: DeferredPrepassOptions, stage: SceneInstance3D) {
    const settings = deferredSettingsFromOptions(renderer, options);
    const framebuffer = new DeferredFrameBuffer(renderer.gl as WebGL2RenderingContext, {
      width: settings.width,
      height: settings.height,
      useDepthTexture: true,
      pbrEnabled: true,
      emissiveEnabled: settings.emissiveEnabled,
    });

    super(
      renderer,
      {
        depthTestEnabled: true,
        clearOnBegin: renderer.gl.COLOR_BUFFER_BIT | renderer.gl.DEPTH_BUFFER_BIT,
        faceCullingEnabled: true,
        alphaBlendingEnabled: true,
        viewportX: 0,
        viewportY: 0,
        viewportHeight: settings.height,
        viewportWidth: settings.width,
        framebuffer,
      },
      stage,
    );

    this.emissiveEnabled = settings.emissiveEnabled;
  }
}
