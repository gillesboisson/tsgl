import { SpriteBatch, SpriteBatchRenderable } from './SpriteBatch';

export interface ElementI<GroupT extends GroupI<ElementI<GroupT, WorldCoordT>, WorldCoordT>, WorldCoordT>
  extends SpriteBatchRenderable<WorldCoordT> {
  parent: GroupT;
  visible: boolean;
}

export interface GroupI<ElementT extends ElementI<GroupI<ElementT, WorldCoordT>, WorldCoordT>, WorldCoordT>
  extends ElementI<GroupI<ElementT, WorldCoordT>, WorldCoordT> {
  addChild(child: ElementT, renderOrder?: number): void;

  removeChild(child: ElementT): void;
}

export class Group implements GroupI<ElementI<any, any>, any> {
  protected _children: ElementI<Group, any>[] = [];
  constructor() {}
  parent: Group;
  visible: boolean;

  draw(batch: SpriteBatch): void {
    for (const child of this._children) {
      if (child.visible === true) {
        child.draw(batch);
      }
    }
  }

  addChild(child: ElementI<any, any>, renderOrder?: number): void {
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

  removeChild(child: ElementI<any, any>): void {
    const ind = this._children.indexOf(child);
    if (ind !== -1) {
      this._children.splice(ind, 1);
      delete child.parent;
    }
  }
}
