import { GLAttribute } from './GLAttribute';

export interface IGLAttributesCollection {}

export class GLAttributesCollection extends Array<GLAttribute> {
  constructor(props: any) {
    super(props);
    // this.__props = [];
  }
}
