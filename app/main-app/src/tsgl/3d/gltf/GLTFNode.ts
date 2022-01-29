import { AnyWebRenderingGLContext } from '@tsgl/gl';
import { IMaterial } from '../../common';
import { SceneInstance3D } from '../../common';
import { GLTFDataNode } from './GLFTSchema';
import { IGLTFCore } from './GLTFCore';
import { GLTFMesh } from './GLTFMesh';
import { mat4 } from 'gl-matrix';
import { Camera, IRenderableInstance3D, ITransform } from '../../common';

export class GLTFNode
  extends SceneInstance3D
  implements IRenderableInstance3D<ITransform<mat4>>, IGLTFCore<GLTFDataNode> {
  protected _mesh: GLTFMesh;
  protected _data: GLTFDataNode;

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

  constructor(mesh: GLTFMesh, data?: GLTFDataNode) {
    super();
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
  render<MaterialT extends IMaterial = IMaterial>(
    gl: AnyWebRenderingGLContext,
    cam: Camera,
    material?: MaterialT,
  ): void {
    // cam.mvp(this._material.shaderState.mvp, this._worldMat);

    const primitives = this._mesh.primitives;

    // material.prepare(gl, cam, this._worldMat);

    for (const primitive of primitives) {
      // material.drawVao(gl, primitive.vao, primitive.nbElements, primitive.indicesType);
      primitive.render(gl, cam, this._worldMat, material);
    }

    // material.unbind(gl);

    // this._material.render(cam, this._worldMat, this._mesh.vaos,);
  }
}
