import { WasmClass } from '../../../wasm/WasmClass';
import { wasmStruct } from '../../../wasm/decorators/classes';
import { WasmAllocatorI } from '../../../wasm/allocators/interfaces';
import { AQueuePass } from './AQueuePass';
import { structAttr } from '../../../core/decorators/StructAttribute';
import { MAX_ELEMENT_PER_QUEUES } from '../Renderer';
import { wasmFunctionOut } from '../../../wasm/decorators/methods';
@wasmStruct({ methodsPrefix: 'QueuePassCollection_' })
export class QueuePassCollection<QueuePassType extends AQueuePass = AQueuePass> extends WasmClass {
  // Static ====================================
  static byteLength: number;
  static allocator: WasmAllocatorI<QueuePassCollection<AQueuePass>>;
  // WASM Props ====================================
  @structAttr({
    type: Uint32Array,
    length: 2,
  })
  private _metas: Uint32Array;
  // WASM methods ====================================

  @wasmFunctionOut('print')
  printWasm: () => void;

  // Props ====================================
  private _queuePtrsBuffer: Uint32Array;
  private _queues: QueuePassType[];
  private _queuesName: string[];
  // Static ====================================
  // Accessors ====================================
  protected get bufferPtr(): number {
    return this._metas[0];
  }
  public get length(): number {
    return this._metas[1];
  }
  // Methods ====================================
  // constructor(module?: EmscriptenModule, ptr?: number, firstInit?: boolean) {
  // super(module, ptr, firstInit);
  // }
  init(firstInit?: boolean) {
    if (firstInit) {
      const bufferPtr = (this._metas[0] = this._module._malloc(MAX_ELEMENT_PER_QUEUES * Uint32Array.BYTES_PER_ELEMENT));
      this._queuePtrsBuffer = new Uint32Array(this._module.HEAP32.buffer, bufferPtr, MAX_ELEMENT_PER_QUEUES);
      this._queues = [];
      this._queuesName = [];
      this._metas[1] = 0;
    }
  }
  destroy(freePtr?: boolean) {
    this._module._free(this._metas[0]);
    this._queues.splice(0);
    this._queuesName.splice(0);
    super.destroy(freePtr);
    delete this._queuePtrsBuffer;
    delete this._queues;
    delete this._queuesName;
  }
  protected _addQueuePass(name: string, queuePass: QueuePassType): void {
    this._queuePtrsBuffer[this._queuesName.length] = queuePass.ptr;
    this._queuesName.push(name);
    this._queues.push(queuePass);
    this._metas[1]++;
  }
  addQueuePass(name: string, queuePass: QueuePassType, at: number = this._metas[1], orFail = true): void {
    const length = this._metas[1];
    if (this._queuesName.indexOf(name) !== -1) {
      if (orFail)
        throw new Error('PassQueueCollection::addQueuePass : A queue pass with this name already exists ' + name);
      return;
    }
    if (this._queuesName.length >= this._queuePtrsBuffer.length)
      throw new Error('PassQueueCollection::addQueuePass : Reach queues amount limit');
    if (at >= length) return this._addQueuePass(name, queuePass);
    if (at < 0) at = 0;
    for (let i = length - 1; i >= at; i--) {
      this._queuePtrsBuffer[at + 1] = this._queuePtrsBuffer[at];
    }
    this._queuePtrsBuffer[at] = queuePass.ptr;
    this._queuesName.splice(at, 0, name);
    this._queues.splice(at, 0, queuePass);
    this._metas[1]++;
  }
  removeQueuePass(name: string, orFail = true): void {
    const queuePosition = this._queuesName.indexOf(name);
    if (queuePosition === -1) {
      if (orFail)
        throw new Error("PassQueueCollection::addQueuePass : A queue pass with this name doesn't exists " + name);
      return;
    }
    if (this._queuesName.length >= this._queuePtrsBuffer.length)
      throw new Error('PassQueueCollection::addQueuePass : Reach queues amount limit');
    for (let i = queuePosition; i < this._queues.length - 1; i++) {
      this._queuePtrsBuffer[i] = this._queuePtrsBuffer[i + 1];
    }
    this._queuesName.splice(queuePosition, 1);
    this._queues.splice(queuePosition, 1);
    this._metas[1]--;
  }

  getQueuePass(name: string, orFail: boolean = false): QueuePassType {
    const queuePosition = this._queuesName.indexOf(name);
    if (queuePosition === -1) {
      if (orFail)
        throw new Error("PassQueueCollection::addQueuePass : A queue pass with this name doesn't exists " + name);
      return;
    }

    return this._queues[queuePosition];
  }

  applyAllPass() {
    for (const pass of this._queues) {
      pass.apply();
    }
  }
}
