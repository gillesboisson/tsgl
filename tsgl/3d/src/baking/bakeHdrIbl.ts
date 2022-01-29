import { IGLTexture, WebGL2Renderer, loadHDR, rgbeToFloat, loadHDRToFloatTexture, createCubemapEmptyTexture, wrapTexture } from '@tsgl/gl';
import { HDRToCubemap } from './HDRRectToCubemap';
import { IrradianceCubemapRenderer } from './IrradianceCubemapRenderer';
import { ReflectanceCubemapRenderer } from './ReflectanceCubemapRenderer';

export interface HdrIblSettings {
  source: string | { data: Float32Array; width: number; height: number };
  baseCubemap: {
    size: number;
    sourceTexture?: WebGLTexture;
  };
  irradiance?: {
    size: number;
    sourceTexture?: WebGLTexture;
  };
  reflectance?: {
    size: number;
    sourceTexture?: WebGLTexture;
    levels?: number;
  };
  lut?: {
    size: number;
    sourceTexture?: WebGLTexture;
  };
}

export interface HdrIbl {
  source: { data: Float32Array; width: number; height: number };
  baseCubemap: { size: number; cubemap: IGLTexture };
  irradiance?: { size: number; cubemap: IGLTexture };
  reflectance?: { size: number; cubemap: IGLTexture; levels: number };
  lut?: { size: number; lookupTexture: IGLTexture };
}

export async function bakeHdrIbl(renderer: WebGL2Renderer, settings: HdrIblSettings): Promise<HdrIbl> {
  const { source, irradiance, reflectance,  baseCubemap } = settings;

  // load HDR into a planar texture
  const gl = renderer.gl as WebGL2RenderingContext;

  let hdrW: number;
  let hdrH: number;
  let hdrData: Float32Array;

  if (typeof source === 'string') {
    const hdr = await loadHDR(source as string);
    hdrW = hdr.width;
    hdrH = hdr.height;
    hdrData = rgbeToFloat(hdr.img);
  } else {
    hdrW = source.width;
    hdrH = source.height;
    hdrData = source.data;
  }

  const { texture: hdrTexture } = loadHDRToFloatTexture(gl as WebGL2RenderingContext, hdrW, hdrH, hdrData);

  // load render planar HDR to cubemap

  const cubemap = baseCubemap.sourceTexture
    ? baseCubemap.sourceTexture
    : createCubemapEmptyTexture(gl, baseCubemap.size, gl.RGBA16F, gl.RGBA, gl.FLOAT).texture;

  const res: HdrIbl = {
    source: {
      data: hdrData,
      width: hdrW,
      height: hdrH,
    },
    baseCubemap: {
      cubemap: wrapTexture(gl, cubemap, gl.TEXTURE_CUBE_MAP),
      size: baseCubemap.size,
    },
  };

  const framebuffer = gl.createFramebuffer();

  const hdrRenderer = new HDRToCubemap(renderer as WebGL2Renderer, baseCubemap.size, framebuffer);
  hdrRenderer.source = hdrTexture;
  hdrRenderer.dest = cubemap;
  hdrRenderer.render();

  if (irradiance) {
    const irradianceCubemap =
      irradiance.sourceTexture || createCubemapEmptyTexture(gl, irradiance.size, gl.RGBA16F, gl.RGBA, gl.FLOAT).texture;

    const irradianceRenderer = new IrradianceCubemapRenderer(renderer as WebGL2Renderer, irradiance.size);

    irradianceRenderer.source = cubemap;
    irradianceRenderer.dest = irradianceCubemap;
    irradianceRenderer.render();

    res.irradiance = {
      cubemap: wrapTexture(gl, irradianceCubemap, gl.TEXTURE_CUBE_MAP),
      size: irradiance.size,
    };
  }

  if (reflectance) {
    const reflectanceCubemapRenderer = new ReflectanceCubemapRenderer(
      renderer as WebGL2Renderer,
      reflectance.size,
      reflectance.levels,
      framebuffer,
    );

    const reflectanceTexture = reflectanceCubemapRenderer.render(cubemap, reflectance.sourceTexture);

    res.reflectance = {
      cubemap: wrapTexture(gl, reflectanceTexture, gl.TEXTURE_CUBE_MAP),

      size: reflectance.size,
      levels: reflectance.levels,
    };
  }

  // TODO: fix shader
  // if (lut) {
  //   const brdfLut: IGLTexture = lut.sourceTexture
  //     ? { width: lut.size, height: lut.size, texture: lut.sourceTexture }
  //     : createEmptyTextureWithLinearFilter(gl, lut.size, lut.size, gl.RGBA16F, gl.RGBA, gl.FLOAT);

  //   renderBRDFLut(renderer, brdfLut);

  //   res.lut = {
  //     lookupTexture: new GLTexture({ gl, texture: brdfLut.texture }, gl.TEXTURE_2D),
  //     size: lut.size,
  //   };
  // }

  gl.deleteFramebuffer(framebuffer);

  return res;
}
