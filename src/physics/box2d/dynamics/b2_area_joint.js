"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.b2AreaJoint = exports.b2AreaJointDef = void 0;
// DEBUG: import { b2Assert } from "../common/b2_settings";
var b2_settings_js_1 = require("../common/b2_settings.js");
var b2_math_js_1 = require("../common/b2_math.js");
var b2_joint_js_1 = require("./b2_joint.js");
var b2_distance_joint_js_1 = require("./b2_distance_joint.js");
var b2AreaJointDef = /** @class */ (function (_super) {
    __extends(b2AreaJointDef, _super);
    function b2AreaJointDef() {
        var _this = _super.call(this, b2_joint_js_1.b2JointType.e_areaJoint) || this;
        _this.bodies = [];
        _this.stiffness = 0;
        _this.damping = 0;
        return _this;
    }
    b2AreaJointDef.prototype.AddBody = function (body) {
        this.bodies.push(body);
        if (this.bodies.length === 1) {
            this.bodyA = body;
        }
        else if (this.bodies.length === 2) {
            this.bodyB = body;
        }
    };
    return b2AreaJointDef;
}(b2_joint_js_1.b2JointDef));
exports.b2AreaJointDef = b2AreaJointDef;
var b2AreaJoint = /** @class */ (function (_super) {
    __extends(b2AreaJoint, _super);
    function b2AreaJoint(def) {
        var _this = _super.call(this, def) || this;
        _this.m_stiffness = 0;
        _this.m_damping = 0;
        // Solver shared
        _this.m_impulse = 0;
        _this.m_targetArea = 0;
        _this.m_delta = new b2_math_js_1.b2Vec2();
        // DEBUG: b2Assert(def.bodies.length >= 3, "You cannot create an area joint with less than three bodies.");
        _this.m_bodies = def.bodies;
        _this.m_stiffness = b2_settings_js_1.b2Maybe(def.stiffness, 0);
        _this.m_damping = b2_settings_js_1.b2Maybe(def.damping, 0);
        _this.m_targetLengths = b2_settings_js_1.b2MakeNumberArray(def.bodies.length);
        _this.m_normals = b2_math_js_1.b2Vec2.MakeArray(def.bodies.length);
        _this.m_joints = []; // b2MakeNullArray(def.bodies.length);
        _this.m_deltas = b2_math_js_1.b2Vec2.MakeArray(def.bodies.length);
        var djd = new b2_distance_joint_js_1.b2DistanceJointDef();
        djd.stiffness = _this.m_stiffness;
        djd.damping = _this.m_damping;
        _this.m_targetArea = 0;
        for (var i = 0; i < _this.m_bodies.length; ++i) {
            var body = _this.m_bodies[i];
            var next = _this.m_bodies[(i + 1) % _this.m_bodies.length];
            var body_c = body.GetWorldCenter();
            var next_c = next.GetWorldCenter();
            _this.m_targetLengths[i] = b2_math_js_1.b2Vec2.DistanceVV(body_c, next_c);
            _this.m_targetArea += b2_math_js_1.b2Vec2.CrossVV(body_c, next_c);
            djd.Initialize(body, next, body_c, next_c);
            _this.m_joints[i] = body.GetWorld().CreateJoint(djd);
        }
        _this.m_targetArea *= 0.5;
        return _this;
    }
    b2AreaJoint.prototype.GetAnchorA = function (out) {
        return out;
    };
    b2AreaJoint.prototype.GetAnchorB = function (out) {
        return out;
    };
    b2AreaJoint.prototype.GetReactionForce = function (inv_dt, out) {
        return out;
    };
    b2AreaJoint.prototype.GetReactionTorque = function (inv_dt) {
        return 0;
    };
    b2AreaJoint.prototype.SetStiffness = function (stiffness) {
        this.m_stiffness = stiffness;
        for (var i = 0; i < this.m_joints.length; ++i) {
            this.m_joints[i].SetStiffness(stiffness);
        }
    };
    b2AreaJoint.prototype.GetStiffness = function () {
        return this.m_stiffness;
    };
    b2AreaJoint.prototype.SetDamping = function (damping) {
        this.m_damping = damping;
        for (var i = 0; i < this.m_joints.length; ++i) {
            this.m_joints[i].SetDamping(damping);
        }
    };
    b2AreaJoint.prototype.GetDamping = function () {
        return this.m_damping;
    };
    b2AreaJoint.prototype.Dump = function (log) {
        log("Area joint dumping is not supported.\n");
    };
    b2AreaJoint.prototype.InitVelocityConstraints = function (data) {
        for (var i = 0; i < this.m_bodies.length; ++i) {
            var prev = this.m_bodies[(i + this.m_bodies.length - 1) % this.m_bodies.length];
            var next = this.m_bodies[(i + 1) % this.m_bodies.length];
            var prev_c = data.positions[prev.m_islandIndex].c;
            var next_c = data.positions[next.m_islandIndex].c;
            var delta = this.m_deltas[i];
            b2_math_js_1.b2Vec2.SubVV(next_c, prev_c, delta);
        }
        if (data.step.warmStarting) {
            this.m_impulse *= data.step.dtRatio;
            for (var i = 0; i < this.m_bodies.length; ++i) {
                var body = this.m_bodies[i];
                var body_v = data.velocities[body.m_islandIndex].v;
                var delta = this.m_deltas[i];
                body_v.x += body.m_invMass * delta.y * 0.5 * this.m_impulse;
                body_v.y += body.m_invMass * -delta.x * 0.5 * this.m_impulse;
            }
        }
        else {
            this.m_impulse = 0;
        }
    };
    b2AreaJoint.prototype.SolveVelocityConstraints = function (data) {
        var dotMassSum = 0;
        var crossMassSum = 0;
        for (var i = 0; i < this.m_bodies.length; ++i) {
            var body = this.m_bodies[i];
            var body_v = data.velocities[body.m_islandIndex].v;
            var delta = this.m_deltas[i];
            dotMassSum += delta.LengthSquared() / body.GetMass();
            crossMassSum += b2_math_js_1.b2Vec2.CrossVV(body_v, delta);
        }
        var lambda = -2 * crossMassSum / dotMassSum;
        // lambda = b2Clamp(lambda, -b2_maxLinearCorrection, b2_maxLinearCorrection);
        this.m_impulse += lambda;
        for (var i = 0; i < this.m_bodies.length; ++i) {
            var body = this.m_bodies[i];
            var body_v = data.velocities[body.m_islandIndex].v;
            var delta = this.m_deltas[i];
            body_v.x += body.m_invMass * delta.y * 0.5 * lambda;
            body_v.y += body.m_invMass * -delta.x * 0.5 * lambda;
        }
    };
    b2AreaJoint.prototype.SolvePositionConstraints = function (data) {
        var perimeter = 0;
        var area = 0;
        for (var i = 0; i < this.m_bodies.length; ++i) {
            var body = this.m_bodies[i];
            var next = this.m_bodies[(i + 1) % this.m_bodies.length];
            var body_c = data.positions[body.m_islandIndex].c;
            var next_c = data.positions[next.m_islandIndex].c;
            var delta = b2_math_js_1.b2Vec2.SubVV(next_c, body_c, this.m_delta);
            var dist = delta.Length();
            if (dist < b2_settings_js_1.b2_epsilon) {
                dist = 1;
            }
            this.m_normals[i].x = delta.y / dist;
            this.m_normals[i].y = -delta.x / dist;
            perimeter += dist;
            area += b2_math_js_1.b2Vec2.CrossVV(body_c, next_c);
        }
        area *= 0.5;
        var deltaArea = this.m_targetArea - area;
        var toExtrude = 0.5 * deltaArea / perimeter;
        var done = true;
        for (var i = 0; i < this.m_bodies.length; ++i) {
            var body = this.m_bodies[i];
            var body_c = data.positions[body.m_islandIndex].c;
            var next_i = (i + 1) % this.m_bodies.length;
            var delta = b2_math_js_1.b2Vec2.AddVV(this.m_normals[i], this.m_normals[next_i], this.m_delta);
            delta.SelfMul(toExtrude);
            var norm_sq = delta.LengthSquared();
            if (norm_sq > b2_math_js_1.b2Sq(b2_settings_js_1.b2_maxLinearCorrection)) {
                delta.SelfMul(b2_settings_js_1.b2_maxLinearCorrection / b2_math_js_1.b2Sqrt(norm_sq));
            }
            if (norm_sq > b2_math_js_1.b2Sq(b2_settings_js_1.b2_linearSlop)) {
                done = false;
            }
            body_c.x += delta.x;
            body_c.y += delta.y;
        }
        return done;
    };
    return b2AreaJoint;
}(b2_joint_js_1.b2Joint));
exports.b2AreaJoint = b2AreaJoint;
