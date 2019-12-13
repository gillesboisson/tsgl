import { GLRenderer, GLRendererType } from './gl/core/GLRenderer';
import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import { GLBuffer } from './gl/core/data/GLBuffer';
import { GLShader } from './gl/core/shader/GLShader';
import { getDefaultAttributeLocation, GLDefaultAttributesLocation } from './gl/core/data/GLDefaultAttributesLocation';
import { InterleavedDataArray } from './gl/data/InterleavedDataArray';
import { IInterleaveData } from './gl/data/IInterleaveData';
import { interleavedData } from './gl/data/InterleavedData.decorator';

import { GLTexture } from './gl/core/GLTexture';
import { GLAttribute } from './gl/core/data/GLAttribute';
import { GLMesh } from './gl/core/data/GLMesh';
import { AGLBatch, GLBatchable, pullMethod } from './gl/core/data/AGLBatch';
import { AnyWebRenderingGLContext } from './gl/core/GLHelpers';
import { GLFramebuffer } from './gl/core/framebuffer/GLFramebuffer';
import { glInterleavedAttributes } from './gl/core/data/gLInterleavedAttributes';
import { GLAttributesCollection } from './gl/core/data/GLAttributesCollection';
import { cpus } from 'os';
import { SimpleColorShader } from './shaders/SimpleColorShader';
import { GLVariantShader } from './gl/core/shader/variants/GLVariantShader';
import { TestVariantShader, ColorMode } from './shaders/TestVariantShader';
import { TestUBOShader, TestUBOShaderState } from './shaders/TestUboShader';
import { TestTFShader } from './shaders/TestTFShader';
import { generateTriangle } from './shaders/generateTriangle';
import { generateRandomData } from './shaders/generateRandomData';
import { TestTFdata } from './shaders/TestTFdata';
import { TestTFShaderRender } from './shaders/TestTFShaderRender';
import { GLVao } from './gl/core/data/GLVao';
import { compileTFProgram } from './gl/core/shader/compileProgram';
import { GLTransformFeedbackPass } from './gl/core/GLTransformFeedbackPass';
import { WasmClass } from './wasm/WasmClass';
import { structAttr } from './core/decorators/StructAttribute';

import { EmscriptenModuleLoader } from './wasm/EmscriptenModuleLoader';

const loader: EmscriptenModuleLoader = new EmscriptenModuleLoader();

loader.load('em_app.js').then((module) => {
  console.log(module);
});
