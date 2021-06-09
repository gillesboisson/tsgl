import { ElementI, GroupI } from '../tsgl/2d/Group';
import { WorldCoords } from '../tsgl/2d/sprite/ElementData';
import { Sprite } from '../tsgl/2d/sprite/Sprite';
import { SpriteElement } from '../tsgl/2d/sprite/SpriteElement';
import { SpriteGroup } from '../tsgl/2d/sprite/SpriteGroup';
import { SpriteBatch } from '../tsgl/2d/SpriteBatch';
import { b2Transform, XY } from './box2d/common/b2_math';
import { b2Body, b2BodyType } from './box2d/dynamics/b2_body';
import { RubeBody } from './rube';
import { ImageData } from './RubeLoader';

export interface PhysicsTo2DOptions {
  unitPixelConv: XY;
  unitAngleConv: number;
}

const defaultOptions: PhysicsTo2DOptions = {
  unitPixelConv: { x: 16, y: -16 },
  unitAngleConv: -1,
};

export interface IPhysicsSprite<SpriteT extends Sprite = Sprite> {
  sprite: SpriteT;
  imageData: ImageData;
  body?: b2Body;
  bodyData?: RubeBody;
}

export class PhysicsSprite<SpriteT extends Sprite = Sprite> implements IPhysicsSprite<SpriteT> {
  sprite: SpriteT;
  imageData: ImageData;
  body?: b2Body;
  bodyData?: RubeBody;
  protected _position: XY = { x: 0, y: 0 };
  protected _angle = 0;

  constructor(data: IPhysicsSprite<SpriteT>) {
    this.sprite = data.sprite;
    this.imageData = data.imageData;
    this.body = data.body;
    this.bodyData = data.bodyData;
  }

  update(unitPixelConv: XY, unitAngleConv: number, dynamicOnly = true): void {
    const body = this.body;
    const imageXY = this.imageData.position;
    let angle = this.imageData.angle;

    if ((dynamicOnly && !body) || body.GetType() === b2BodyType.b2_staticBody) return;

    if (body !== undefined) {
      b2Transform.MulXV(body.GetTransform(), this._position, this.imageData.position);
      angle += body.GetAngle();
    } else {
      this._position.x = imageXY.x;
      this._position.y = imageXY.y;
    }

    this._position.x *= unitPixelConv.x;
    this._position.y *= unitPixelConv.y;
    this._angle = angle * unitAngleConv;

    this.sprite.rotation = this._angle;
    this.sprite.setPosition(this._position.x, this._position.y);
  }
}

export class PhysicsTo2D implements PhysicsTo2DOptions, ElementI<GroupI<SpriteElement, WorldCoords>, WorldCoords> {
  unitPixelConv: XY;
  unitAngleConv: number;

  group = new SpriteGroup();

  protected children: PhysicsSprite[] = [];

  add(child: IPhysicsSprite | PhysicsSprite): void {
    if (child instanceof PhysicsSprite) {
      this.children.push(child);
    } else {
      this.children.push(new PhysicsSprite(child));
    }
  }

  remove(child: PhysicsSprite): void {
    const ind = this.children.indexOf(child);
    if (ind !== -1) {
      this.children.splice(ind, 1);
    }
  }

  constructor(options: Partial<PhysicsTo2DOptions>) {
    const { unitAngleConv, unitPixelConv } = { ...defaultOptions, ...options };
    this.unitAngleConv = unitAngleConv;
    this.unitPixelConv = unitPixelConv;
  }

  parent: GroupI<SpriteElement, WorldCoords>;
  visible: boolean;
  draw(batch: SpriteBatch, parentWorldCoords?: WorldCoords): void {
    this.group.draw(batch, parentWorldCoords);
  }
}
