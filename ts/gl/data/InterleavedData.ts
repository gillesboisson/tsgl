import { vec2, vec3, vec4 } from 'gl-matrix';
import { Type } from '../../core/Type';

export interface WithUv {
  uv: vec2;
}

export interface WithPosition {
  position: vec3;
}

export interface WithColor {
  color: vec4;
}
