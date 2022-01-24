import { mat4, vec3 } from 'gl-matrix';
import { TranslateRotateTransform3D } from './TranslateRotateTransform3D';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const IDENT_MAT4 = mat4.create();
export const tv = vec3.create();
export const __lookAtBaseVec = vec3.fromValues(0, 0, -1);

export type CameraTransform3D = TranslateRotateTransform3D;
