import { GLAttribute } from './GLAttribute';

export interface IGLAttributesCollection {}

export class GLAttributesCollection extends Array<GLAttribute> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(props: any) {
    super(props);
    // this.__props = [];
  }
}
