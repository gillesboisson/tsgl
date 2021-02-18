
import { GLDefaultTextureLocation } from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { GLVao } from '../../tsgl/gl/core/data/GLVao';
import { GLFramebuffer } from '../../tsgl/gl/core/framebuffer/GLFramebuffer';
import { GLRenderer } from '../../tsgl/gl/core/GLRenderer';
import { GLTexture } from '../../tsgl/gl/core/GLTexture';
import { PlaneSpaceToModelSpaceNormalShaderID, PlaneSpaceToModelSpaceNormalShaderState } from '../../tsgl/shaders/PlaceSpaceToModelSpaceNormalShader';

export function convertPlaceSpaceToModelSpaceNormalMap(rendererer: GLRenderer, refMeshVao: GLVao, refMeshNbElements: number, normalMap: GLTexture): GLTexture{
  const gl = rendererer.gl;
  const shaderState = rendererer.getShader(PlaneSpaceToModelSpaceNormalShaderID).createState() as PlaneSpaceToModelSpaceNormalShaderState;
  const modelSpaceFramebuffer = new GLFramebuffer(gl,normalMap.width,normalMap.height,false,true,false,false);

  modelSpaceFramebuffer.bind();
  // const format = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_FORMAT);
  // const type = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_TYPE);

  gl.disable(gl.CULL_FACE);
  shaderState.use();
  refMeshVao.bind();
  normalMap.active(GLDefaultTextureLocation.NORMAL);
  gl.drawElements(gl.TRIANGLES,refMeshNbElements,gl.UNSIGNED_SHORT,0);
  
  refMeshVao.unbind();
  gl.enable(gl.CULL_FACE);
  modelSpaceFramebuffer.unbind();

  const resultTexture = modelSpaceFramebuffer.colorTexture;
  modelSpaceFramebuffer.destroy(true,true, false);

  return resultTexture;
}