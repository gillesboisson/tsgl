import { wasmStruct } from '../wasm/decorators/classes';
import { structAttr, wasmObjectAttr, structBool } from '../core/decorators/StructAttribute';
import { WasmTransform } from '../geom/WasmTransform';
import { WasmPoolAllocator } from '../wasm/allocators/WasmPoolAllocator';
import { WasmClassRelocatable } from '../wasm/WasmClassRelocatable';
import { WasmPtrVector } from '../wasm/WasmPtrVector';
import { SceneNodeType } from './SceneNodeType';
import { wasmFunctionOut } from '../wasm/decorators/methods';
import { mat4 } from 'gl-matrix';
import { AMaterial } from '../tsgl/materials/AMaterial';
@wasmStruct({ methodsPrefix: 'SceneNode_', allocator: new WasmPoolAllocator({ wasmType: SceneNode }) })
export class SceneNode extends WasmClassRelocatable {
  static byteLength: number;
  static allocator: WasmPoolAllocator<SceneNode>;

  // Wasm Attribute Binding ------------------------------------------------------------------------------------

  @structAttr({
    length: 1,
    type: Uint32Array,
  })
  private _updateWorldMatMethodPtr: number;

  @structAttr({
    type: Uint32Array,
    length: 1,
  })
  protected _nodeType: SceneNodeType;

  @structBool()
  protected _visible: boolean;

  @structBool()
  protected _worldVisible: boolean;

  // @structAttr({ type: Uint8Array, length: 2 })
  // private _margin: Uint8Array;

  @structAttr({
    // margin: 2,
    type: Uint32Array,
    length: 1,
  })
  private _transformPtr: number;

  @structAttr({
    type: Float32Array,
    length: 16,
  })
  public worldMat: mat4;

  @structAttr({
    type: Float32Array,
    length: 6,
  })
  protected _bounds: Float32Array;

  @wasmObjectAttr(WasmPtrVector)
  _childrenPtrVector: WasmPtrVector<SceneNode>;

  @structAttr({
    type: Uint32Array,
    length: 1,
  })
  protected _renderingPassPtr: number;

  // Wasm Function Binding ------------------------------------------------------------------------------------

  @wasmFunctionOut('updateWorldMat', ['number', 'number'], null)
  wasmUpdateWorldMat: (parentMatPtr: number, parentWasDirty: boolean) => void;

  @wasmFunctionOut('updateChildrenWorldVisible')
  protected _updateChildrenWorldVisible: () => void;

  @wasmFunctionOut('test')
  test: () => void;

  @wasmFunctionOut('initUpdateWorldMatMethod')
  private _initUpdateWorldMatMethod: () => void;

  // Properties ------------------------------------------------------------------------------------

  private _children: SceneNode[] = [];
  private _transform: WasmTransform;
  private _material: AMaterial<any>;

  get material(): AMaterial<any> {
    return this._material;
  }

  // Accessors ------------------------------------------------------------------------------------

  set material(val: AMaterial<any>) {
    if (this._material !== val) {
      this._material = val;
      this._renderingPassPtr = val ? val.renderingPass.ptr : 0;
    }
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(val: boolean) {
    if (this._visible !== val) {
      this._visible = val;
      this._worldVisible = val;
      this._updateChildrenWorldVisible();
    }
  }

  get worldVisible(): boolean {
    return this._worldVisible;
  }

  get nodeType() {
    return this._nodeType;
  }

  init(firstInit?: boolean) {
    if (firstInit === true) {
      mat4.identity(this.worldMat);
      this._renderingPassPtr = 0;
      this._visible = true;
      this._worldVisible = true;
      this.bindUpdateWorldMatMethod();
    }

    if (this._transform === undefined) {
      this._transform = new WasmTransform(this._module);
    }
    this._transformPtr = this._transform.ptr;
    this._nodeType = SceneNodeType.Dynamic;
  }

  protected bindUpdateWorldMatMethod() {
    this._initUpdateWorldMatMethod();
  }

  addChild(tr: SceneNode) {
    console.log('this._childrenPtrVector.bufferPtr : ', this._childrenPtrVector.bufferPtr, SceneNode.byteLength);

    if (this._children.indexOf(tr) === -1) {
      this._childrenPtrVector.add(tr);
      this._children.push(tr);
    }
  }

  removeChild(tr: SceneNode) {
    const ind = this._children.indexOf(tr);
    if (ind !== -1) {
      this._children.splice(ind, 1);
      this._childrenPtrVector.remove(tr);
    }
  }

  get transform(): WasmTransform {
    return this._transform;
  }

  destroy(freePtr?: boolean) {
    this._childrenPtrVector.destroy(false);
    this._transform.destroy(freePtr);

    delete this._transform;
    delete this._childrenPtrVector;
    delete this._children;

    super.destroy(freePtr);
  }

  getChildren() {
    return this._children;
  }
}
