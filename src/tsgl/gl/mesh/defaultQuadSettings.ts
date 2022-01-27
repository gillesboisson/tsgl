import { QuadSettings } from '.';

// default quad settings : flip UV Y

export function defaultQuadSettings(): QuadSettings {
  return {
    quadLeft: -1,
    quadTop: -1,
    quadRight: 1,
    quadBottom: 1,
    quadDepth: 0,
    uvLeft: 0,
    uvRight: 1,
    uvTop: 1,
    uvBottom: 0,
  };
}
