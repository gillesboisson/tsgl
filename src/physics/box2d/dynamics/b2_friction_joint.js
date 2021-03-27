"use strict";
/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
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
exports.b2FrictionJoint = exports.b2FrictionJointDef = void 0;
var b2_settings_js_1 = require("../common/b2_settings.js");
var b2_math_js_1 = require("../common/b2_math.js");
var b2_joint_js_1 = require("./b2_joint.js");
/// Friction joint definition.
var b2FrictionJointDef = /** @class */ (function (_super) {
    __extends(b2FrictionJointDef, _super);
    function b2FrictionJointDef() {
        var _this = _super.call(this, b2_joint_js_1.b2JointType.e_frictionJoint) || this;
        _this.localAnchorA = new b2_math_js_1.b2Vec2();
        _this.localAnchorB = new b2_math_js_1.b2Vec2();
        _this.maxForce = 0;
        _this.maxTorque = 0;
        return _this;
    }
    b2FrictionJointDef.prototype.Initialize = function (bA, bB, anchor) {
        this.bodyA = bA;
        this.bodyB = bB;
        this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
        this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
    };
    return b2FrictionJointDef;
}(b2_joint_js_1.b2JointDef));
exports.b2FrictionJointDef = b2FrictionJointDef;
var b2FrictionJoint = /** @class */ (function (_super) {
    __extends(b2FrictionJoint, _super);
    function b2FrictionJoint(def) {
        var _this = _super.call(this, def) || this;
        _this.m_localAnchorA = new b2_math_js_1.b2Vec2();
        _this.m_localAnchorB = new b2_math_js_1.b2Vec2();
        // Solver shared
        _this.m_linearImpulse = new b2_math_js_1.b2Vec2();
        _this.m_angularImpulse = 0;
        _this.m_maxForce = 0;
        _this.m_maxTorque = 0;
        // Solver temp
        _this.m_indexA = 0;
        _this.m_indexB = 0;
        _this.m_rA = new b2_math_js_1.b2Vec2();
        _this.m_rB = new b2_math_js_1.b2Vec2();
        _this.m_localCenterA = new b2_math_js_1.b2Vec2();
        _this.m_localCenterB = new b2_math_js_1.b2Vec2();
        _this.m_invMassA = 0;
        _this.m_invMassB = 0;
        _this.m_invIA = 0;
        _this.m_invIB = 0;
        _this.m_linearMass = new b2_math_js_1.b2Mat22();
        _this.m_angularMass = 0;
        _this.m_qA = new b2_math_js_1.b2Rot();
        _this.m_qB = new b2_math_js_1.b2Rot();
        _this.m_lalcA = new b2_math_js_1.b2Vec2();
        _this.m_lalcB = new b2_math_js_1.b2Vec2();
        _this.m_K = new b2_math_js_1.b2Mat22();
        _this.m_localAnchorA.Copy(b2_settings_js_1.b2Maybe(def.localAnchorA, b2_math_js_1.b2Vec2.ZERO));
        _this.m_localAnchorB.Copy(b2_settings_js_1.b2Maybe(def.localAnchorB, b2_math_js_1.b2Vec2.ZERO));
        _this.m_linearImpulse.SetZero();
        _this.m_maxForce = b2_settings_js_1.b2Maybe(def.maxForce, 0);
        _this.m_maxTorque = b2_settings_js_1.b2Maybe(def.maxTorque, 0);
        _this.m_linearMass.SetZero();
        return _this;
    }
    b2FrictionJoint.prototype.InitVelocityConstraints = function (data) {
        this.m_indexA = this.m_bodyA.m_islandIndex;
        this.m_indexB = this.m_bodyB.m_islandIndex;
        this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
        this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
        this.m_invMassA = this.m_bodyA.m_invMass;
        this.m_invMassB = this.m_bodyB.m_invMass;
        this.m_invIA = this.m_bodyA.m_invI;
        this.m_invIB = this.m_bodyB.m_invI;
        // const cA: b2Vec2 = data.positions[this.m_indexA].c;
        var aA = data.positions[this.m_indexA].a;
        var vA = data.velocities[this.m_indexA].v;
        var wA = data.velocities[this.m_indexA].w;
        // const cB: b2Vec2 = data.positions[this.m_indexB].c;
        var aB = data.positions[this.m_indexB].a;
        var vB = data.velocities[this.m_indexB].v;
        var wB = data.velocities[this.m_indexB].w;
        // const qA: b2Rot = new b2Rot(aA), qB: b2Rot = new b2Rot(aB);
        var qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB);
        // Compute the effective mass matrix.
        // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
        b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
        var rA = b2_math_js_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
        // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
        b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
        var rB = b2_math_js_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
        // J = [-I -r1_skew I r2_skew]
        //     [ 0       -1 0       1]
        // r_skew = [-ry; rx]
        // Matlab
        // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
        //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
        //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;
        var K = this.m_K; // new b2Mat22();
        K.ex.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
        K.ex.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
        K.ey.x = K.ex.y;
        K.ey.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;
        K.GetInverse(this.m_linearMass);
        this.m_angularMass = iA + iB;
        if (this.m_angularMass > 0) {
            this.m_angularMass = 1 / this.m_angularMass;
        }
        if (data.step.warmStarting) {
            // Scale impulses to support a variable time step.
            // m_linearImpulse *= data.step.dtRatio;
            this.m_linearImpulse.SelfMul(data.step.dtRatio);
            this.m_angularImpulse *= data.step.dtRatio;
            // const P: b2Vec2(m_linearImpulse.x, m_linearImpulse.y);
            var P = this.m_linearImpulse;
            // vA -= mA * P;
            vA.SelfMulSub(mA, P);
            // wA -= iA * (b2Cross(m_rA, P) + m_angularImpulse);
            wA -= iA * (b2_math_js_1.b2Vec2.CrossVV(this.m_rA, P) + this.m_angularImpulse);
            // vB += mB * P;
            vB.SelfMulAdd(mB, P);
            // wB += iB * (b2Cross(m_rB, P) + m_angularImpulse);
            wB += iB * (b2_math_js_1.b2Vec2.CrossVV(this.m_rB, P) + this.m_angularImpulse);
        }
        else {
            this.m_linearImpulse.SetZero();
            this.m_angularImpulse = 0;
        }
        // data.velocities[this.m_indexA].v = vA;
        data.velocities[this.m_indexA].w = wA;
        // data.velocities[this.m_indexB].v = vB;
        data.velocities[this.m_indexB].w = wB;
    };
    b2FrictionJoint.prototype.SolveVelocityConstraints = function (data) {
        var vA = data.velocities[this.m_indexA].v;
        var wA = data.velocities[this.m_indexA].w;
        var vB = data.velocities[this.m_indexB].v;
        var wB = data.velocities[this.m_indexB].w;
        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;
        var h = data.step.dt;
        // Solve angular friction
        {
            var Cdot = wB - wA;
            var impulse = (-this.m_angularMass * Cdot);
            var oldImpulse = this.m_angularImpulse;
            var maxImpulse = h * this.m_maxTorque;
            this.m_angularImpulse = b2_math_js_1.b2Clamp(this.m_angularImpulse + impulse, (-maxImpulse), maxImpulse);
            impulse = this.m_angularImpulse - oldImpulse;
            wA -= iA * impulse;
            wB += iB * impulse;
        }
        // Solve linear friction
        {
            // b2Vec2 Cdot = vB + b2Cross(wB, m_rB) - vA - b2Cross(wA, m_rA);
            var Cdot_v2 = b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2_math_js_1.b2Vec2.s_t1), b2FrictionJoint.SolveVelocityConstraints_s_Cdot_v2);
            // b2Vec2 impulse = -b2Mul(m_linearMass, Cdot);
            var impulseV = b2_math_js_1.b2Mat22.MulMV(this.m_linearMass, Cdot_v2, b2FrictionJoint.SolveVelocityConstraints_s_impulseV).SelfNeg();
            // b2Vec2 oldImpulse = m_linearImpulse;
            var oldImpulseV = b2FrictionJoint.SolveVelocityConstraints_s_oldImpulseV.Copy(this.m_linearImpulse);
            // m_linearImpulse += impulse;
            this.m_linearImpulse.SelfAdd(impulseV);
            var maxImpulse = h * this.m_maxForce;
            if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse) {
                this.m_linearImpulse.Normalize();
                this.m_linearImpulse.SelfMul(maxImpulse);
            }
            // impulse = m_linearImpulse - oldImpulse;
            b2_math_js_1.b2Vec2.SubVV(this.m_linearImpulse, oldImpulseV, impulseV);
            // vA -= mA * impulse;
            vA.SelfMulSub(mA, impulseV);
            // wA -= iA * b2Cross(m_rA, impulse);
            wA -= iA * b2_math_js_1.b2Vec2.CrossVV(this.m_rA, impulseV);
            // vB += mB * impulse;
            vB.SelfMulAdd(mB, impulseV);
            // wB += iB * b2Cross(m_rB, impulse);
            wB += iB * b2_math_js_1.b2Vec2.CrossVV(this.m_rB, impulseV);
        }
        // data.velocities[this.m_indexA].v = vA;
        data.velocities[this.m_indexA].w = wA;
        // data.velocities[this.m_indexB].v = vB;
        data.velocities[this.m_indexB].w = wB;
    };
    b2FrictionJoint.prototype.SolvePositionConstraints = function (data) {
        return true;
    };
    b2FrictionJoint.prototype.GetAnchorA = function (out) {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
    };
    b2FrictionJoint.prototype.GetAnchorB = function (out) {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
    };
    b2FrictionJoint.prototype.GetReactionForce = function (inv_dt, out) {
        out.x = inv_dt * this.m_linearImpulse.x;
        out.y = inv_dt * this.m_linearImpulse.y;
        return out;
    };
    b2FrictionJoint.prototype.GetReactionTorque = function (inv_dt) {
        return inv_dt * this.m_angularImpulse;
    };
    b2FrictionJoint.prototype.GetLocalAnchorA = function () { return this.m_localAnchorA; };
    b2FrictionJoint.prototype.GetLocalAnchorB = function () { return this.m_localAnchorB; };
    b2FrictionJoint.prototype.SetMaxForce = function (force) {
        this.m_maxForce = force;
    };
    b2FrictionJoint.prototype.GetMaxForce = function () {
        return this.m_maxForce;
    };
    b2FrictionJoint.prototype.SetMaxTorque = function (torque) {
        this.m_maxTorque = torque;
    };
    b2FrictionJoint.prototype.GetMaxTorque = function () {
        return this.m_maxTorque;
    };
    b2FrictionJoint.prototype.Dump = function (log) {
        var indexA = this.m_bodyA.m_islandIndex;
        var indexB = this.m_bodyB.m_islandIndex;
        log("  const jd: b2FrictionJointDef = new b2FrictionJointDef();\n");
        log("  jd.bodyA = bodies[%d];\n", indexA);
        log("  jd.bodyB = bodies[%d];\n", indexB);
        log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
        log("  jd.localAnchorA.Set(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
        log("  jd.localAnchorB.Set(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
        log("  jd.maxForce = %.15f;\n", this.m_maxForce);
        log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
        log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
    };
    b2FrictionJoint.SolveVelocityConstraints_s_Cdot_v2 = new b2_math_js_1.b2Vec2();
    b2FrictionJoint.SolveVelocityConstraints_s_impulseV = new b2_math_js_1.b2Vec2();
    b2FrictionJoint.SolveVelocityConstraints_s_oldImpulseV = new b2_math_js_1.b2Vec2();
    return b2FrictionJoint;
}(b2_joint_js_1.b2Joint));
exports.b2FrictionJoint = b2FrictionJoint;
