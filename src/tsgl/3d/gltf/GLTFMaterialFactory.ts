import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { IGLTexture } from '../../gl/core/texture/GLTexture';
import { IMaterial } from '../Material/IMaterial';
import { PhongBlinnMaterial } from '../Material/PhongBlinnMaterial';
import { GLTFDataMaterial, GLTFDataMeshPrimitive } from './GLFTSchema';

export interface UseForGLTF<SettingsT = any> {
  matchGTFMaterialData(material: GLTFDataMaterial): boolean;

  useForGLTF(
    renderer: GLRenderer,
    material: GLTFDataMaterial,
    primitive: GLTFDataMeshPrimitive,
    textures: IGLTexture[],
    settings: SettingsT,
  ): IMaterial;
}

export class GLTFMaterialFactory<SettingsT = any> {
  constructor(readonly renderer: GLRenderer, readonly materialTypes: UseForGLTF<SettingsT>[]) {}

  factory(
    material: GLTFDataMaterial,
    primitive: GLTFDataMeshPrimitive,
    textures: IGLTexture[],
    settings: SettingsT,
  ): IMaterial {
    const finalMat = this.materialTypes
      .find((type) => type.matchGTFMaterialData(material))
      ?.useForGLTF(this.renderer, material, primitive, textures, settings);
    if (!finalMat) throw new Error('No material matching this primitive');

    return finalMat;
  }
}
