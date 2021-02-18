
export interface QuadSettings {
  quadLeft: number;
  quadTop: number;
  quadRight: number;
  quadBottom: number;
  quadDepth: number;
  uvLeft: number;
  uvRight: number;
  uvTop: number;
  uvBottom: number;
}

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

/**
 *
 * @param nbQuads requested quad count
 */
export default function generateDefaultQuadIndices(nbQuads: number): Uint16Array {
  const nbIndices = nbQuads * 6;
  const result = new Uint16Array(nbIndices);

  for (let i = 0; i < nbQuads; i++) {
    const quadInd = i * 4;
    const IndicesInd = i * 6;

    result[IndicesInd] = quadInd;
    result[IndicesInd + 1] = quadInd + 1;
    result[IndicesInd + 2] = quadInd + 2;
    result[IndicesInd + 3] = quadInd + 1;
    result[IndicesInd + 4] = quadInd + 3;
    result[IndicesInd + 5] = quadInd + 2;
  }

  return result;
}


