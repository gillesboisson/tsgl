import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { IGLTexture } from '../../gl/core/texture/GLTexture';
import { IMaterial } from '../../utils/primitive/IMaterial';
import { PhongBlinnMaterial } from '../Material/PhongBlinnMaterial';
import { GLTFDataMaterial, GLTFDataMeshPrimitive } from './GLFTSchema';

export interface UseForGLTF<SettingsT = any> {
  matchGTFMaterialData(material: GLTFDataMaterial): boolean;

  buildFromGLTF(
    renderer: GLRenderer,
    material: GLTFDataMaterial,
    primitive: GLTFDataMeshPrimitive,
    textures: IGLTexture[],
    settings: SettingsT,
  ): IMaterial;
}

export class GLTFMaterialFactory<SettingsT = any> {
  constructor(
    readonly renderer: GLRenderer,
    readonly materialTypes: UseForGLTF<SettingsT>[],
    readonly materialsData: GLTFDataMaterial[],
    readonly textures: IGLTexture[],
    readonly settings: SettingsT,
  ) {}

  factory(primitive: GLTFDataMeshPrimitive): IMaterial {
    const materialData = this.materialsData[primitive.material];
    const finalMat = this.materialTypes
      .find((type) => type.matchGTFMaterialData(materialData))
      ?.buildFromGLTF(this.renderer, materialData, primitive, this.textures, this.settings);
    if (!finalMat) throw new Error('No material matching this primitive');

    return finalMat;
  }
}
