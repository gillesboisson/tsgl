// import {rotToVec2Normal} from "~/dotgl/math/helpers";
import { vec2 } from 'gl-matrix';
import { b2ChainShape } from './box2d/collision/b2_chain_shape';
import { b2CircleShape } from './box2d/collision/b2_circle_shape';
import { b2PolygonShape } from './box2d/collision/b2_polygon_shape';
import { b2MassData } from './box2d/collision/b2_shape';
import { b2Vec2, XY } from './box2d/common/b2_math';
import { b2Body, b2BodyDef, b2BodyType } from './box2d/dynamics/b2_body';
import { b2DistanceJointDef } from './box2d/dynamics/b2_distance_joint';
import { b2Fixture, b2FixtureDef } from './box2d/dynamics/b2_fixture';
import { b2FrictionJointDef } from './box2d/dynamics/b2_friction_joint';
import { b2Joint, b2JointType } from './box2d/dynamics/b2_joint';
import { b2MotorJointDef } from './box2d/dynamics/b2_motor_joint';
import { b2PrismaticJointDef } from './box2d/dynamics/b2_prismatic_joint';
import { b2RevoluteJointDef } from './box2d/dynamics/b2_revolute_joint';
import { b2WeldJointDef } from './box2d/dynamics/b2_weld_joint';
import { b2WheelJointDef } from './box2d/dynamics/b2_wheel_joint';
import { b2World } from './box2d/dynamics/b2_world';
import { b2RopeDef } from './box2d/rope/b2_rope';
import { rotToVec2Normal } from './math';
import { RubeBody, RubeCustomProperty, RubeFixture, RubeJoint, RubeWorld } from './rube';

type ImageData = {
  name?: string;
  filename: string;
  file: string;
  bounds: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  position: XY;
  width: number;
  height: number;
  scale: number;
  angle: number;
};

class RubeParameters {
  world: b2World;
  positionIterations: number;
  velocityIterations: number;
  stepsPerSecond: number;
  fixtures: { [name: string]: b2Fixture[] };
  bodies: { [name: string]: b2Body[] };
  joints: { [name: string]: b2Joint[] };
  constructor() {
    this.world = null;
    this.positionIterations = 0;
    this.velocityIterations = 0;
    this.stepsPerSecond = 0;
    this.fixtures = {};
    this.bodies = {};
    this.joints = {};
    Object.seal(this);
  }
}

class RUBELoader {
  joints: b2Joint[];
  images: ImageData[];
  constructor() {}

  parseVector(obj: Partial<XY>): b2Vec2 {
    return new b2Vec2(obj ? obj.x || 0 : 0, obj ? obj.y || 0 : 0);
  }

  parseVectorArray = function (obj: { x: []; y: [] }): b2Vec2[] {
    let i: number;

    const vals: b2Vec2[] = new Array(obj.x.length);
    i = 0;
    while (i < vals.length) {
      vals[i] = new b2Vec2(obj.x[i], obj.y[i]);
      ++i;
    }
    return vals;
  };

  parseProperty = function (obj: RubeCustomProperty, instance: any): void {
    const name = obj.name;
    let val: any;
    val = void 0;
    if (typeof obj['int'] !== 'undefined') {
      val = obj['int'];
    } else if (typeof obj['float'] !== 'undefined') {
      val = obj['float'];
    } else if (typeof obj['string'] !== 'undefined') {
      val = obj['string'];
    } else if (typeof obj['bool'] !== 'undefined') {
      val = obj['bool'];
    } else if (typeof obj['bool'] !== 'undefined') {
      val = obj['bool'];
    } else if (typeof obj.vec2 !== 'undefined') {
      val = this.parseVector(obj.vec2);
    } else {
      throw new Error('unknown property type');
    }
    if (instance.hasOwnProperty(name)) {
      throw new Error('custom property possibly overwriting an existing one');
    }
    instance[name] = val;
  };

  parseFixture = function (obj: RubeFixture, body: b2Body) {
    // var def, fixture, i, shape, vertices;
    const def = new b2FixtureDef();
    def.density = obj.density || 0;
    def.filter.categoryBits = typeof obj['filter-categoryBits'] === 'undefined' ? 1 : obj['filter-categoryBits'];
    def.filter.maskBits = typeof obj['filter-maskBits'] === 'undefined' ? 65535 : obj['filter-maskBits'];
    def.filter.groupIndex = typeof obj['filter-groupIndex'] === 'undefined' ? 0 : obj['filter-groupIndex'];
    def.friction = obj.friction || 0;
    def.restitution = obj.restitution || 0;
    def.isSensor = !!obj.sensor;
    let shape: any;

    if (typeof (obj as any).circle !== 'undefined') {
      shape = new b2CircleShape();
      shape.Set(this.parseVector((obj as any).circle.center), (obj as any).circle.radius);
      // shape.m_radius = obj.circle.radius || 0;
    } else if (typeof (obj as any).polygon !== 'undefined') {
      const vertices = this.parseVectorArray((obj as any).polygon.vertices);
      shape = new b2PolygonShape();
      shape.Set(vertices, vertices.length);
    } else if (typeof (obj as any).chain !== 'undefined') {
      const vertices = this.parseVectorArray((obj as any).chain.vertices);
      shape = new b2ChainShape();
      shape.m_count = vertices.length;
      shape.m_vertices = vertices;

      // TODO: check
      // if (shape.m_hasNextVertex = (obj as any).chain.hasNextVertex) {
      //   shape.m_nextVertex = this.parseVector((obj as any).chain.nextVertex);
      // }
      // if (shape.m_hasPrevVertex = (obj as any).chain.hasPrevVertex) {
      //   shape.m_prevVertex = this.parseVector((obj as any).chain.prevVertex);
      // }
    } else {
      throw new Error('unknown shape type');
    }
    def.shape = shape;
    const fixture = body.CreateFixture(def);
    fixture.name = obj.name;
    if (obj.customProperties) {
      let i = 0;
      while (i < obj.customProperties.length) {
        this.parseProperty(obj.customProperties[i], fixture);
        ++i;
      }
    }
  };

  filterBodyData(data: any): any {
    return data;
  }

  parseBody(obj: RubeBody, world: b2World) {
    const def = new b2BodyDef();
    def.type = (obj.type as any) || b2BodyType.b2_staticBody;
    def.angle = obj.angle || 0;
    def.angularDamping = obj.angularDamping || 0;
    def.angularVelocity = obj.angularVelocity || 0;
    def.awake = obj.awake || false;
    def.bullet = obj.bullet || false;
    def.fixedRotation = obj.fixedRotation || false;
    def.linearDamping = obj.linearDamping || null;
    def.linearVelocity.Copy(this.parseVector(obj.linearVelocity));
    def.gravityScale = typeof obj.gravityScale !== 'undefined' ? obj.gravityScale : 1;
    const md = new b2MassData();
    md.mass = obj['massData-mass'] || 0;
    md.center.Copy(this.parseVector(obj['massData-center']));
    md.I = obj['massData-I'] || 0;
    def.position.Copy(this.parseVector(obj.position));
    const body = world.CreateBody(def);
    body.name = obj.name;

    // if(def.type ===  b2BodyType.b2_staticBody){

    //   body.vec2Normal = rotToVec2Normal(vec2.create(),def.angle);
    // }

    body.SetMassData(md);
    if (obj.fixture) {
      let i = 0;
      while (i < obj.fixture.length) {
        this.parseFixture(obj.fixture[i], body);
        ++i;
      }
    }
    if (obj.customProperties) {
      let i = 0;
      while (i < obj.customProperties.length) {
        this.parseProperty(obj.customProperties[i], body);
        ++i;
      }

      //debugger;
    }
    if (this.bodyCreated) {
      this.bodyCreated(body);
    }
    return body;
  }

  bodyCreated?: (body: b2Body) => void;
  bodies: b2Body[];

  getBodiesWithProperty(propertyName: string): b2Body[] {
    const res: b2Body[] = [];
    const ref = this.bodies;

    for (let j = 0, len = ref.length; j < len; j++) {
      const body = ref[j] as any;
      if (body[propertyName] != null) {
        res.push(body);
      }
    }
    return res;
  }

  getBodiesOfType(type: b2BodyType): b2Body[] {
    const res: b2Body[] = [];
    const ref = this.bodies;

    for (let j = 0, len = ref.length; j < len; j++) {
      const body = ref[j];
      if (body.GetType() === type) {
        res.push(body);
      }
    }
    return res;
  }

  getBodyFromName(name: string): b2Body {
    const res: b2Body[] = [];
    const ref = this.bodies;

    for (let j = 0, len = ref.length; j < len; j++) {
      const body = ref[j];
      if (body.name === name) {
        return body;
      }
    }
    return null;
  }

  getJointFromName = function (name: string): b2Joint {

    const ref = this.joints;
    for (let j = 0, len = ref.length; j < len; j++) {
      const joint = ref[j];
      if (joint.name === name) {
        return joint;
      }
    }
    return null;
  };

  getImagesWithProperty = function (propertyName: string): ImageData[] {
    const res: ImageData[] = [];
    const ref = this.images;
    for (let j = 0, len = ref.length; j < len; j++) {
      const image = ref[j];
      if (image[propertyName] != null) {
        res.push(image);
      }
    }
    return res;
  };

  getImagesOfType = function (type: any): ImageData[] {
    const res: ImageData[] = [];
    const ref = this.images;
    for (let j = 0, len = ref.length; j < len; j++) {
      const image = ref[j];
      if (image.type === type) {
        res.push(image);
      }
    }
    return res;
  };

  getImageFromName = function (name: string): ImageData {
    const ref = this.images;
    for (let j = 0, len = ref.length; j < len; j++) {
      const image = ref[j];
      if (image.name === name) {
        return image;
      }
    }
    return null;
  };

  clear = function (world: b2World): void {
    if (this.joints && this.joints.length) {
      const ref = this.joints;
      for (let j = 0, len = ref.length; j < len; j++) {
        const joins = ref[j];
        world.DestroyJoint(joins);
      }
    }
    if (this.bodies && this.bodies.length) {
      const ref1 = this.bodies;
      // results = [];
      for (let k = 0, len1 = ref1.length; k < len1; k++) {
        const body = ref1[k];
        if (body.sprite && body.sprite.parent) {
          body.sprite.parent.removeChild(body.sprite);
        }
        // results.push(world.DestroyBody(body));
      }
      // return results;
    }
  };

  parseJoint = function (obj: RubeJoint, world: b2World, bodies: b2Body[]): b2Joint {
    // var i, jd, joint;
    if (!this.jointsList[obj.type]) {
      throw new Error('unknown joint type');
    }
    const jd = new this.jointsList[obj.type]();
    switch (jd.type) {
      case b2JointType.e_revoluteJoint:
        jd.localAnchorA = this.parseVector(obj.anchorA);
        jd.localAnchorB = this.parseVector(obj.anchorB);
        jd.enableLimit = (b2Joint as any).enableLimit || false;
        jd.enableMotor = (b2Joint as any).enableMotor || false;
        jd.lowerAngle = (b2Joint as any).lowerLimit || 0;
        jd.maxMotorTorque = (b2Joint as any).maxMotorTorque || 0;
        jd.motorSpeed = (b2Joint as any).motorSpeed || 0;
        jd.referenceAngle = (b2Joint as any).refAngle || 0;
        jd.upperAngle = (b2Joint as any).upperLimit || 0;
        break;
      case b2JointType.e_distanceJoint:
        jd.localAnchorA = this.parseVector(obj.anchorA);
        jd.localAnchorB = this.parseVector(obj.anchorB);
        jd.dampingRatio = (b2Joint as any).dampingRatio || 0;
        jd.frequencyHz = (b2Joint as any).frequency || 0;
        jd.length = (b2Joint as any).length || 0;
        break;
      case b2JointType.e_prismaticJoint:
        jd.localAnchorA = this.parseVector(obj.anchorA);
        jd.localAnchorB = this.parseVector(obj.anchorB);
        jd.enableLimit = (b2Joint as any).enableLimit || false;
        jd.enableMotor = (b2Joint as any).enableMotor || false;
        jd.localAxisA = this.parseVector((b2Joint as any).localAxisA);
        jd.lowerTranslation = (b2Joint as any).lowerLimit || 0;
        jd.maxMotorForce = (b2Joint as any).maxMotorForce || 0;
        jd.motorSpeed = (b2Joint as any).motorSpeed || 0;
        jd.referenceAngle = (b2Joint as any).refAngle || 0;
        jd.upperTranslation = (b2Joint as any).upperLimit || 0;
        break;
      case b2JointType.e_wheelJoint:
        jd.localAnchorA = this.parseVector(obj.anchorA);
        jd.localAnchorB = this.parseVector(obj.anchorB);
        jd.enableMotor = (b2Joint as any).enableMotor || false;
        jd.localAxisA = this.parseVector((b2Joint as any).localAxisA);
        jd.maxMotorTorque = (b2Joint as any).maxMotorTorque || 0;
        jd.motorSpeed = (b2Joint as any).motorSpeed || 0;
        jd.dampingRatio = (b2Joint as any).springDampingRatio || 0;
        jd.frequencyHz = (b2Joint as any).springFrequency || 0;
        break;
      case b2JointType.e_ropeJoint:
        jd.localAnchorA = this.parseVector(obj.anchorA);
        jd.localAnchorB = this.parseVector(obj.anchorB);
        jd.maxLength = (b2Joint as any).maxLength || 0;
        break;
      case b2JointType.e_motorJoint:
        jd.linearOffset = this.parseVector(obj.anchorA);
        jd.angularOffset = (b2Joint as any).refAngle || 0;
        jd.maxForce = (b2Joint as any).maxForce || 0;
        jd.maxTorque = (b2Joint as any).maxTorque || 0;
        jd.correctionFactor = (b2Joint as any).correctionFactor || 0;
        break;
      case b2JointType.e_weldJoint:
        jd.localAnchorA = this.parseVector(obj.anchorA);
        jd.localAnchorB = this.parseVector(obj.anchorB);
        jd.referenceAngle = (b2Joint as any).refAngle || 0;
        jd.dampingRatio = (b2Joint as any).dampingRatio || 0;
        jd.frequencyHz = (b2Joint as any).frequencyHz || 0;
        break;
      case b2JointType.e_frictionJoint:
        jd.localAnchorA = this.parseVector(obj.anchorA);
        jd.localAnchorB = this.parseVector(obj.anchorB);
        jd.maxForce = (b2Joint as any).maxForce || 0;
        jd.maxTorque = (b2Joint as any).maxTorque || 0;
        break;
      default:
        throw new Error('wat?');
    }
    jd.bodyA = bodies[obj.bodyA || 0];
    jd.bodyB = bodies[obj.bodyB || 0];
    jd.collideConnected = obj.collideConnected || false;
    const joint = world.CreateJoint(jd);
    joint.name = obj.name;
    if (obj.customProperties) {
      let i = 0;
      while (i < obj.customProperties.length) {
        this.parseProperty(obj.customProperties[i], joint);
        ++i;
      }
    }
    return joint;
  };

  parseWorld(obj: RubeWorld, world: b2World) {
    // var bl, body, f, i, img, imgs, jl, joint, params, bodyData;
    const params = new RubeParameters();
    params.world = world = world || new b2World(new b2Vec2(0, 0));
    params.positionIterations = obj.positionIterations || 0;
    params.velocityIterations = obj.velocityIterations || 0;
    params.stepsPerSecond = obj.stepsPerSecond || 0;
    if (obj.gravity) {
      world.SetGravity(this.parseVector(obj.gravity));
    }
    world.SetAllowSleeping(obj.allowSleep || false);
    world.SetAutoClearForces(obj.autoClearForces || false);
    world.SetWarmStarting(obj.warmStarting || false);
    world.SetContinuousPhysics(obj.continuousPhysics || false);
    world.SetSubStepping(obj.subStepping || false);
    this.bodies = [];
    const bl = obj.body;
    if (bl) {
      let i = 0;
      while (i < bl.length) {
        const bodyData = this.filterBodyData(bl[i]);
        if (!bodyData) continue;

        const body = this.parseBody(bodyData, world);
        this.bodies.push(body);
        let f = body.GetFixtureList();
        while (f) {
          if (!params.fixtures[f.name]) {
            params.fixtures[f.name] = [];
          }
          params.fixtures[f.name].push(f);
          f = f.GetNext();
        }
        if (!params.bodies[body.name]) {
          params.bodies[body.name] = [];
        }
        params.bodies[body.name].push(body);
        ++i;
      }
    }
    this.joints = [];
    const jl = obj.joint;
    if (jl) {
      let i = 0;
      while (i < jl.length) {
        const joint = this.parseJoint(jl[i], world, this.bodies);
        this.joints.push(joint);
        if (!params.joints[joint.name]) {
          params.joints[joint.name] = [];
        }
        params.joints[joint.name].push(joint);
        ++i;
      }
    }
    this.images = [];
    const imgs = obj.image;
    if (imgs) {
      let i = 0;
      while (i < imgs.length) {
        const obj = imgs[i];
        const img: ImageData = {
          name: obj.name,
          filename: obj.file.split('/').pop(),
          file: obj.file,
          bounds: {
            left: obj.corners.x[0],
            right: obj.corners.x[1],
            top: obj.corners.y[0],
            bottom: obj.corners.y[2],
          },
          position: this.parseVector(obj.center),
          width: obj.corners.x[1] - obj.corners.x[0],
          height: obj.corners.y[2] - obj.corners.y[0],
          scale: obj.scale,
          angle: obj.angle,
        };
        if (obj.customProperties) {
          let f = 0;
          while (f < obj.customProperties.length) {
            this.parseProperty(obj.customProperties[f], img);
            ++f;
          }
        }
        this.images.push(img);
        i++;
      }
    }
    return params;
  }

  jointsList = {
    revolute: b2RevoluteJointDef,
    distance: b2DistanceJointDef,
    prismatic: b2PrismaticJointDef,
    wheel: b2WheelJointDef,
    rope: b2RopeDef,
    motor: b2MotorJointDef,
    weld: b2WeldJointDef,
    friction: b2FrictionJointDef,
  };
}
export { RubeParameters };

export default RUBELoader;

// ---
// generated by coffee-script 1.9.2
