import { SimpleElement } from './SimpleSpriteElement';
import { SimpleWorldCoords } from './SimpleElementData';
import { SpriteBatch } from '../SpriteBatch';
import { GroupI } from '../Group';

export class SimpleGroup extends SimpleElement implements GroupI<SimpleElement, SimpleWorldCoords> {
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

  addChild(child: SimpleElement, renderOrder?: number): void {
    if (this._children.indexOf(child) === -1) {
      if (child.parent !== undefined) child.parent.removeChild(this);
      if (renderOrder === undefined) {
        this._children.push(child);
      } else {
        this._children.splice(renderOrder, 0, child);
      }

      child.parent = this;
    }
  }

  removeChild(child: SimpleElement): void {
    const ind = this._children.indexOf(child);
    if (ind !== -1) {
      this._children.splice(ind, 1);
      delete child.parent;
    }
  }
}
