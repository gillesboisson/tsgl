import { GLAttribute } from '../../gl/core/data/GLAttribute';
import { GLBuffer } from '../../gl/core/data/GLBuffer';
import {
  getDefaultAttributeLocation,
  GLDefaultAttributesLocation,
} from '../../gl/core/data/GLDefaultAttributesLocation';
import { GLVao } from '../../gl/core/data/GLVao';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import {
  GLTFData,
  GLTFDataAccessor,
  GLTFDataBuffer,
  GLTFDataBufferView,
  GLTFDataMesh,
  GLTFDataMeshPrimitive,
} from './GLFTSchema';

export function parse(gltfData: GLTFData) {}

export async function loadBuffers(
  gltfData: GLTFData,
  assetDirectory: string,
  bufferLoaded?: (ind: number, buffer: ArrayBuffer) => void,
): Promise<Uint8Array[]> {
  const bufferData = gltfData.buffers;
  let bufferToload = bufferData.length;

  const result = new Array(bufferToload);

  const parrallelLoad = 4;

  if (bufferToload === 0) return Promise.resolve(result);

  return new Promise((resolve, reject) => {
    let currentBufferInd = 0;

    const loadBuffer = (ind: number) => {
      fetch(`${assetDirectory}/${bufferData[currentBufferInd].uri}`)
        .then((data) => data.arrayBuffer())
        .then((arraBuffer) => loaded(ind, arraBuffer));
    };

    const loaded = (ind: number, data: ArrayBuffer) => {
      if (bufferLoaded !== undefined) bufferLoaded(ind, data);
      bufferToload--;
      result[ind] = data;

      if (bufferToload === 0) {
        resolve(result);
      } else {
        loadBuffer(currentBufferInd);
        currentBufferInd++;
      }
    };

    for (currentBufferInd; currentBufferInd < bufferToload && currentBufferInd < parrallelLoad; currentBufferInd++) {
      loadBuffer(currentBufferInd);
    }
  });
}

// set proper target value based on mesh : set it as ELEMENT_ARRAY_BUFFER if its use to store indices, ARRAY_BUFFER if it used to store vertices
export function setBufferViewTargetFromMesh(gl: AnyWebRenderingGLContext, gltfData: GLTFData) {
  // get a flat of all bufferview indices used for mesh indices
  const indicesBufferViewInd = gltfData.meshes
    .map((mesh) => mesh.primitives.map((p) => p.indices))
    .flat()
    .filter((index, arrayPos, arr) => arr.indexOf(index) === arrayPos);

  // in all existing buffer view set target to right buffer type if its index is in indicesBufferViewInd
  gltfData.bufferViews.forEach((bf, pos) => {
    if (bf.target === undefined) {
      bf.target = indicesBufferViewInd.indexOf(pos) !== -1 ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
    }
  });
}

export function getBufferViewsDataLinkedToBuffer(
  gltfData: GLTFData,
  bufferData: number | GLTFDataBufferView,
): { bufferView: GLTFDataBufferView; ind: number }[] {
  const index = typeof bufferData === 'number' ? bufferData : gltfData.buffers.indexOf(bufferData);

  if (index === -1) return null;

  return gltfData.bufferViews
    .map((bufferView, ind) => ({
      ind,
      bufferView,
    }))
    .filter((bufferView) => bufferView.bufferView.buffer === index);
}

export function loadBufferView(
  gl: AnyWebRenderingGLContext,
  gltfBufferView: GLTFDataBufferView,
  arrayBuffers: ArrayBuffer[] | ArrayBuffer,
  target = gltfBufferView.target,
  drawType: GLenum = gl.STATIC_DRAW,
): GLBuffer {
  if (!target) throw new Error('No target provided (args or buffer view)');

  const finalDrawType = gltfBufferView.extras?.draw_type || drawType;

  // get the right buffer based on index position is provides or use provided buffer
  const arrayBuffer = ((arrayBuffers as any).__proto__ === Array.prototype
    ? ((arrayBuffers as any)[gltfBufferView.buffer] as ArrayBuffer[])
    : arrayBuffers) as ArrayBuffer;

  const ab =
    target === gl.ELEMENT_ARRAY_BUFFER
      ? new Uint16Array(
          arrayBuffer,
          gltfBufferView.byteOffset,
          gltfBufferView.byteLength / Uint16Array.BYTES_PER_ELEMENT,
        )
      : new Float32Array(
          arrayBuffer,
          gltfBufferView.byteOffset,
          gltfBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT,
        );

  console.log(
    target,
    ab,
    gltfBufferView.byteLength / Uint16Array.BYTES_PER_ELEMENT,
    gltfBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT,
  );
  return new GLBuffer(
    gl,
    target,
    finalDrawType,
    new Uint8Array(arrayBuffer, gltfBufferView.byteOffset, gltfBufferView.byteLength),
  );
}

interface GLTFAttribute {
  name: string;
  attributeLocation: GLDefaultAttributesLocation;
  accessor: GLTFDataAccessor;
  bufferView: GLTFDataBufferView;
  bufferViewGL: GLBuffer;
}

// mapping table between default gltf attribute naming and TSGL default attribute location
const defaultAttributes: { [name: string]: number } = {
  POSITION: GLDefaultAttributesLocation.POSITION,
  TEXCOORD_0: GLDefaultAttributesLocation.UV,
  TEXCOORD_1: GLDefaultAttributesLocation.UV2,
  NORMAL: GLDefaultAttributesLocation.NORMAL,
  COLOR_0: GLDefaultAttributesLocation.COLOR,
  TANGENT: GLDefaultAttributesLocation.TANGENT,
  JOINTS_0: GLDefaultAttributesLocation.JOINT,
  WEIGHTS_0: GLDefaultAttributesLocation.WEIGHT,
};

const TypeToCompNumber: { [name: string]: number } = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};

const ComponentTypeToByteLength: number[][] = [
  [5120, 1],
  [5121, 1],
  [5122, 2],
  [5123, 2],
  [5125, 4],
  [5126, 4],
];

export function accessorToGLAttribute(
  gl: AnyWebRenderingGLContext,
  name: string,
  accessor: GLTFDataAccessor,
  bufferView: GLTFDataBufferView,
  glBuffer: GLBuffer,
): GLAttribute {
  const attributeLocation = defaultAttributes[name];
  const compLength = TypeToCompNumber[accessor.type];
  const compTypeLengthP = ComponentTypeToByteLength.find((tbl) => tbl[0] === accessor.componentType);
  if (!compTypeLengthP) throw new Error('Component type not found for ' + JSON.stringify(accessor));
  const stride = bufferView.byteStride ? bufferView.byteStride : compTypeLengthP[1] * compLength;

  return new GLAttribute(
    gl,
    glBuffer,
    attributeLocation,
    name,
    compLength,
    stride,
    accessor.byteOffset,
    accessor.componentType,
    accessor.normalized,
  );
}

export function primitiveToVao(
  gl: AnyWebRenderingGLContext,
  primitive: GLTFDataMeshPrimitive,
  accessors: GLTFDataAccessor[],
  bufferViews: GLTFDataBufferView[],
  glBuffers: GLBuffer[],
) {
  const attributes = Object.keys(primitive.attributes).map((name) => {
    const accessor = accessors[primitive.attributes[name]];
    const bufferView = bufferViews[accessor.bufferView];
    const glBuffer = glBuffers[accessor.bufferView];

    return accessorToGLAttribute(gl, name, accessor, bufferView, glBuffer);
  });

  let indexBuffer: GLBuffer;

  if (primitive.indices) {
    const accessor = accessors[primitive.indices];
    indexBuffer = glBuffers[accessor.bufferView];
  }

  return new GLVao(gl, attributes, indexBuffer);
}
