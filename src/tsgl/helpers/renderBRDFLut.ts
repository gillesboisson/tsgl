// !! Shader not working TODO: clean or remove

// import { createQuadMesh } from '../geom/mesh/createQuadMesh';
// import { GLFramebuffer } from '../gl/core/framebuffer/GLFramebuffer';
// import { GLRenderer } from '../gl/core/GLRenderer';
// import { IGLTexture } from '../gl/core/texture/GLTexture';
// import { BrdfLutShaderID, BrdfLutShaderState } from '../shaders/BrdfLutShader';


// export function renderBRDFLut(renderer: GLRenderer, destTexture: IGLTexture, framebuffer?: WebGLFramebuffer): void{
//   const hadFB = !!framebuffer;
//   const gl = renderer.gl;
//   const lut = renderer.getShader<BrdfLutShaderState>(BrdfLutShaderID).createState();
//   const lutQuad = createQuadMesh(gl);

//   lut.use();

//   if(!hadFB) framebuffer = gl.createFramebuffer(); 

//   gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
//   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, destTexture.texture, 0);

//   gl.viewport(0, 0, destTexture.width, destTexture.height);
//   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
//   lutQuad.draw();
  
//   lutQuad.destroy();
//   gl.bindFramebuffer(gl.FRAMEBUFFER,null);
//   if(!hadFB) gl.deleteFramebuffer(framebuffer);
// }