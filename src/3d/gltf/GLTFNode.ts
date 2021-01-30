import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { IGLMVPShaderState } from '../../gl/core/shader/IGLMVPShaderState';
import { Camera } from '../Camera';
import { IMaterial } from '../Material/IMaterial';
import { IRenderableInstance3D } from '../IRenderableInstance3D';
import { SceneInstance3D } from '../SceneInstance3D';
import { GLTFDataNode } from './GLFTSchema';
import { IGLTFCore } from './GLTFCore';
import { GLTFMesh } from './GLTFMesh';
import { fontDataStride } from '../../2d/text/BitmapFontRaw';
import { IGLShaderState } from '../../gl/core/shader/IGLShaderState';

export class GLTFNode<MaterialT extends IMaterial<IGLShaderState> = IMaterial<IGLShaderState>>
  extends SceneInstance3D
  implements IRenderableInstance3D, IGLTFCore<GLTFDataNode> {
  _material: MaterialT;

  protected _mesh: GLTFMesh;
  protected _data: GLTFDataNode;

  get material(): MaterialT {
    return this._material;
  }
  get mesh(): GLTFMesh {
    return this._mesh;
  }

  get data(): GLTFDataNode {
    return this._data;
  }

  protected _extras?: { [key: string]: string | number };

  customProp<PropT = number | string>(propName: string, defaultVal?: PropT): PropT {
    return (this._extras && this._extras[propName] ? this._extras[propName] : defaultVal) as any;
  }

  constructor(mesh: GLTFMesh, material: MaterialT, data?: GLTFDataNode) {
    super();
    this._material = material;
    this._data = data;
    this._mesh = mesh;

    if (data.translation) {
      this.transform.setPosition(data.translation[0], data.translation[1], data.translation[1]);
    }

    if (data.rotation) {
      this.transform.setRotationQuat(data.rotation[0], data.rotation[1], data.rotation[2], data.rotation[3]);
    }

    if (data.scale) {
      this.transform.setScale(data.scale[0], data.scale[1], data.scale[2]);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(gl: AnyWebRenderingGLContext, cam: Camera): void {
    // cam.mvp(this._material.shaderState.mvp, this._worldMat);

    const primitives = this._mesh.primitives;
    const material = this._material;

    material.prepare(gl, cam, this._worldMat);

    for (const primitive of primitives) {
      material.drawVao(gl, primitive.vao, primitive.nbElements, primitive.indicesType);
    }

    material.unbind(gl);

    // this._material.render(cam, this._worldMat, this._mesh.vaos,);
  }
}
