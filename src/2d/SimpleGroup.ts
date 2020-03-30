import { SimpleElement } from './SimpleElement';
import { SpriteBatchRenderable, SpriteBatch } from './SpriteBatch';
import { SimpleWorldCoords } from './SimpleWorldCoords';
import { vec4 } from 'gl-matrix';

export class SimpleGroup extends SimpleElement implements SpriteBatchRenderable<SimpleWorldCoords> {
  protected _children: SimpleElement[] = [];
  constructor() {
    super(null);
  }

  draw(batch: SpriteBatch, parentWorldCoords?: SimpleWorldCoords): void {
    this.calcWorldCoordinate(parentWorldCoords);
    for (const child of this._children) {
      if (child.visible === true) {
        child.draw(batch, this._worldCoords);
      }
    }
  }

  addChild(child: SimpleElement, renderOrder?: number) {
    if (this._children.indexOf(child) === -1) {
      if (renderOrder === undefined) {
        this._children.push(child);
      } else {
        this._children.splice(renderOrder, 0, child);
      }
    }
  }

  removeChild(child: SimpleElement) {
    const ind = this._children.indexOf(child);
    if (ind !== -1) this._children.splice(ind, 1);
  }
}
