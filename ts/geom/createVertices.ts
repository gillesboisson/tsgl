import { TypedArray, TypedArrayType } from '../core/TypedArray';

export class VerticesArray<T> extends Array{
  buffer:T;
  stride:number;
}

export function createVertices<T>(length_data: number | any[] ,stride: number,ArrayType:TypedArrayType = Float32Array){
  let length;
  let buffer;

  if(typeof length_data === "number" ){
    length = length_data;
    buffer = new ArrayType(length * stride);
  }else{
    length = length_data.length / stride;
    buffer = new ArrayType(length_data);
  }


  const vecs = new Array(length) as VerticesArray<T>;
  for(var i=0;i<length;i++){
    vecs[i] = new ArrayType(buffer.buffer,i*ArrayType.BYTES_PER_ELEMENT*stride,stride);
  }

  vecs.buffer = <unknown>buffer as T;
  vecs.stride = stride;

  return vecs;

}