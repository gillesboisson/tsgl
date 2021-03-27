import { b2BodyType } from './box2d/dynamics/b2_body';

export interface RubeCustomProperty {
  name: string;
  string: string;
  bool?: boolean;
  int?: number;
  float?: number;
  vec2?: PartialVec2;
}

export interface RubeVertices {
  x: number[];
  y: number[];
}

export interface RubePolygon {
  vertices: RubeVertices;
}

export interface Vec2 {
  x: number;
  y: number;
}

export type PartialVec2 = Partial<Vec2>;

export interface RubeCircle {
  center: PartialVec2;
  radius: number;
}

export interface RubeBaseFixture {
  name: string;
  density: number;
  'filter-categoryBits'?: number; //if not present, interpret as number
  'filter-maskBits'?: number; //if not present, interpret as 65535
  'filter-groupIndex'?: number;
  friction: number;
  restitution: number;
  sensor: boolean;
  customProperties?: RubeCustomProperty[];
}

export interface CircleFixture extends RubeBaseFixture {
  circle: RubeCircle;
}

export interface PolyFixture extends RubeBaseFixture {
  polygon: RubePolygon;
}

export type RubeFixture = CircleFixture | PolyFixture;

// export enum BodyType {
//   Static = 0,
//   Kynematic = 1,
//   Dynamic = 2,
// }

export interface RubeBody {
  name: string;
  type: b2BodyType;
  angle: number;
  angularDamping?: number;
  angularVelocity?: number;
  awake?: boolean;
  bullet?: boolean;
  fixedRotation?: boolean;
  linearDamping?: number;
  linearVelocity?: PartialVec2;
  gravityScale?: number;
  customProperties?: RubeCustomProperty[];
  'massData-mass'?: number;
  'massData-center': PartialVec2;
  'massData-I'?: number;
  position: PartialVec2;
  fixture: RubeFixture[];
}

export interface RubeCollisionbitplanes {
  names: string[];
}

export enum RubeJointType {
  Revolute = 'revolute',
  Distance = 'distance',
  Primastic = 'prismatic',
  Wheel = 'wheel',
  Rope = 'rope',
  Motor = 'motor',
  Weld = 'weld',
  Friction = 'friction',
}

export interface RubeBaseJoint {
  type: RubeJointType;
  name: string;
  anchorA: PartialVec2;
  anchorB: PartialVec2;
  bodyA: number; //zero-based index of body in bodies array
  bodyB: number; //zero-based index of body in bodies array
  collideConnected: boolean;
  customProperties?: RubeCustomProperty[]; //An array of zero or more custom properties.
}

export interface RubeRevoluteJoint extends RubeBaseJoint {
  type: RubeJointType.Revolute;
  enableLimit: boolean;
  enableMotor: boolean;
  jointSpeed: number;
  lowerLimit: number;
  maxMotorTorque: number;
  motorSpeed: number;
  refAngle: number;
  upperLimit: number;
}

export interface RubeDistanceJoint extends RubeBaseJoint {
  type: RubeJointType.Distance;

  dampingRatio: number;
  frequency: number;
  length: number;
}
export interface RubePrismaticJoint extends RubeBaseJoint {
  type: RubeJointType.Primastic;
  enableLimit: boolean;
  enableMotor: boolean;
  localAxisA: PartialVec2;
  lowerLimit: number;
  maxMotorForce: number;
  motorSpeed: number;
  refAngle: number;
  upperLimit: number;
}

export interface RubeWheelJoint extends RubeBaseJoint {
  type: RubeJointType.Wheel;
  enableMotor: boolean;
  localAxisA: PartialVec2;
  maxMotorTorque: number;
  motorSpeed: number;
  springDampingRatio: number;
  springFrequency: number;
}

export interface RubeRopeJoint extends RubeBaseJoint {
  type: RubeJointType.Rope;
  maxLength: number;
}

export interface RubeMotorJoint extends RubeBaseJoint {
  type: RubeJointType.Motor;
  maxForce: number;
  maxTorque: number;
  correctionFactor: number;
}

export interface RubeWeldJoint extends RubeBaseJoint {
  type: RubeJointType.Weld;
  refAngle: number;
  dampingRatio: number;
  frequency: number;
}

export interface RubeFrictionJoint extends RubeBaseJoint {
  type: RubeJointType.Friction;
  maxForce: number;
  maxTorque: number;
}

export type RubeJoint =
  | RubeRevoluteJoint
  | RubeDistanceJoint
  | RubePrismaticJoint
  | RubeWheelJoint
  | RubeRopeJoint
  | RubeMotorJoint
  | RubeWeldJoint
  | RubeWeldJoint;

export enum RubeFilterType {
  linear = 0,
  nearest = 1,
}

export interface RubeImage {
  name: string;
  opacity: number; //the length of the vertical side of the image in physics units
  renderOrder: number; //float
  scale: number; //the length of the vertical side of the image in physics units
  aspectScale: number; //the ratio of width to height, relative to the natural dimensions
  angle: number; //radians
  body: number; //zero-based index of body in bodies array
  center: PartialVec2; //center position in body local coordinates
  corners: {x:number[],y:number[]}; //corner positions in body local coordinates
  file: string; //if relative, from the location of the exported file
  filter: RubeJointType; //texture magnification filter, 0 = linear, 1 = nearest
  flip?: number; //true if the texture should be reversed horizontally
  colorTint: number[]; //RGBA values for color tint, if not 255,255,255,255
  glDrawElements: number[];
  glTexCoordPointer: number[];
  glVertexPointer: number[];
  customProperties?: RubeCustomProperty[]; //An array of zero or more custom properties.

}

export interface RubeWorld {
  allowSleep: boolean;
  autoClearForces: boolean;
  body: RubeBody[];
  collisionbitplanes: RubeCollisionbitplanes;
  continuousPhysics: boolean;
  gravity: PartialVec2;
  joint: RubeJoint[];
  image: RubeImage[];
  positionIterations?: number;
  stepsPerSecond?: number;
  subStepping?: boolean;
  velocityIterations?: number;
  warmStarting?: boolean;
  
}
