"use strict";
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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
exports.__esModule = true;
exports.b2ContactSolver = exports.b2PositionSolverManifold = exports.b2ContactSolverDef = exports.b2ContactPositionConstraint = exports.b2ContactVelocityConstraint = exports.b2VelocityConstraintPoint = exports.set_g_blockSolve = exports.get_g_blockSolve = exports.g_blockSolve = void 0;
// DEBUG: import { b2Assert } from "../common/b2_settings";
var b2_settings_js_1 = require("../common/b2_settings.js");
var b2_math_js_1 = require("../common/b2_math.js");
var b2_collision_js_1 = require("../collision/b2_collision.js");
var b2_collision_js_2 = require("../collision/b2_collision.js");
var b2_time_step_js_1 = require("./b2_time_step.js");
// Solver debugging is normally disabled because the block solver sometimes has to deal with a poorly conditioned effective mass matrix.
// #define B2_DEBUG_SOLVER 0
exports.g_blockSolve = false;
function get_g_blockSolve() { return exports.g_blockSolve; }
exports.get_g_blockSolve = get_g_blockSolve;
function set_g_blockSolve(value) { exports.g_blockSolve = value; }
exports.set_g_blockSolve = set_g_blockSolve;
var b2VelocityConstraintPoint = /** @class */ (function () {
    function b2VelocityConstraintPoint() {
        this.rA = new b2_math_js_1.b2Vec2();
        this.rB = new b2_math_js_1.b2Vec2();
        this.normalImpulse = 0;
        this.tangentImpulse = 0;
        this.normalMass = 0;
        this.tangentMass = 0;
        this.velocityBias = 0;
    }
    b2VelocityConstraintPoint.MakeArray = function (length) {
        return b2_settings_js_1.b2MakeArray(length, function (i) { return new b2VelocityConstraintPoint(); });
    };
    return b2VelocityConstraintPoint;
}());
exports.b2VelocityConstraintPoint = b2VelocityConstraintPoint;
var b2ContactVelocityConstraint = /** @class */ (function () {
    function b2ContactVelocityConstraint() {
        this.points = b2VelocityConstraintPoint.MakeArray(b2_settings_js_1.b2_maxManifoldPoints);
        this.normal = new b2_math_js_1.b2Vec2();
        this.tangent = new b2_math_js_1.b2Vec2();
        this.normalMass = new b2_math_js_1.b2Mat22();
        this.K = new b2_math_js_1.b2Mat22();
        this.indexA = 0;
        this.indexB = 0;
        this.invMassA = 0;
        this.invMassB = 0;
        this.invIA = 0;
        this.invIB = 0;
        this.friction = 0;
        this.restitution = 0;
        this.threshold = 0;
        this.tangentSpeed = 0;
        this.pointCount = 0;
        this.contactIndex = 0;
    }
    b2ContactVelocityConstraint.MakeArray = function (length) {
        return b2_settings_js_1.b2MakeArray(length, function (i) { return new b2ContactVelocityConstraint(); });
    };
    return b2ContactVelocityConstraint;
}());
exports.b2ContactVelocityConstraint = b2ContactVelocityConstraint;
var b2ContactPositionConstraint = /** @class */ (function () {
    function b2ContactPositionConstraint() {
        this.localPoints = b2_math_js_1.b2Vec2.MakeArray(b2_settings_js_1.b2_maxManifoldPoints);
        this.localNormal = new b2_math_js_1.b2Vec2();
        this.localPoint = new b2_math_js_1.b2Vec2();
        this.indexA = 0;
        this.indexB = 0;
        this.invMassA = 0;
        this.invMassB = 0;
        this.localCenterA = new b2_math_js_1.b2Vec2();
        this.localCenterB = new b2_math_js_1.b2Vec2();
        this.invIA = 0;
        this.invIB = 0;
        this.type = b2_collision_js_2.b2ManifoldType.e_unknown;
        this.radiusA = 0;
        this.radiusB = 0;
        this.pointCount = 0;
    }
    b2ContactPositionConstraint.MakeArray = function (length) {
        return b2_settings_js_1.b2MakeArray(length, function (i) { return new b2ContactPositionConstraint(); });
    };
    return b2ContactPositionConstraint;
}());
exports.b2ContactPositionConstraint = b2ContactPositionConstraint;
var b2ContactSolverDef = /** @class */ (function () {
    function b2ContactSolverDef() {
        this.step = new b2_time_step_js_1.b2TimeStep();
        this.count = 0;
    }
    return b2ContactSolverDef;
}());
exports.b2ContactSolverDef = b2ContactSolverDef;
var b2PositionSolverManifold = /** @class */ (function () {
    function b2PositionSolverManifold() {
        this.normal = new b2_math_js_1.b2Vec2();
        this.point = new b2_math_js_1.b2Vec2();
        this.separation = 0;
    }
    b2PositionSolverManifold.prototype.Initialize = function (pc, xfA, xfB, index) {
        var pointA = b2PositionSolverManifold.Initialize_s_pointA;
        var pointB = b2PositionSolverManifold.Initialize_s_pointB;
        var planePoint = b2PositionSolverManifold.Initialize_s_planePoint;
        var clipPoint = b2PositionSolverManifold.Initialize_s_clipPoint;
        // DEBUG: b2Assert(pc.pointCount > 0);
        switch (pc.type) {
            case b2_collision_js_2.b2ManifoldType.e_circles: {
                // b2Vec2 pointA = b2Mul(xfA, pc->localPoint);
                b2_math_js_1.b2Transform.MulXV(xfA, pc.localPoint, pointA);
                // b2Vec2 pointB = b2Mul(xfB, pc->localPoints[0]);
                b2_math_js_1.b2Transform.MulXV(xfB, pc.localPoints[0], pointB);
                // normal = pointB - pointA;
                // normal.Normalize();
                b2_math_js_1.b2Vec2.SubVV(pointB, pointA, this.normal).SelfNormalize();
                // point = 0.5f * (pointA + pointB);
                b2_math_js_1.b2Vec2.MidVV(pointA, pointB, this.point);
                // separation = b2Dot(pointB - pointA, normal) - pc->radius;
                this.separation = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(pointB, pointA, b2_math_js_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                break;
            }
            case b2_collision_js_2.b2ManifoldType.e_faceA: {
                // normal = b2Mul(xfA.q, pc->localNormal);
                b2_math_js_1.b2Rot.MulRV(xfA.q, pc.localNormal, this.normal);
                // b2Vec2 planePoint = b2Mul(xfA, pc->localPoint);
                b2_math_js_1.b2Transform.MulXV(xfA, pc.localPoint, planePoint);
                // b2Vec2 clipPoint = b2Mul(xfB, pc->localPoints[index]);
                b2_math_js_1.b2Transform.MulXV(xfB, pc.localPoints[index], clipPoint);
                // separation = b2Dot(clipPoint - planePoint, normal) - pc->radius;
                this.separation = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(clipPoint, planePoint, b2_math_js_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                // point = clipPoint;
                this.point.Copy(clipPoint);
                break;
            }
            case b2_collision_js_2.b2ManifoldType.e_faceB: {
                // normal = b2Mul(xfB.q, pc->localNormal);
                b2_math_js_1.b2Rot.MulRV(xfB.q, pc.localNormal, this.normal);
                // b2Vec2 planePoint = b2Mul(xfB, pc->localPoint);
                b2_math_js_1.b2Transform.MulXV(xfB, pc.localPoint, planePoint);
                // b2Vec2 clipPoint = b2Mul(xfA, pc->localPoints[index]);
                b2_math_js_1.b2Transform.MulXV(xfA, pc.localPoints[index], clipPoint);
                // separation = b2Dot(clipPoint - planePoint, normal) - pc->radius;
                this.separation = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(clipPoint, planePoint, b2_math_js_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                // point = clipPoint;
                this.point.Copy(clipPoint);
                // Ensure normal points from A to B
                // normal = -normal;
                this.normal.SelfNeg();
                break;
            }
        }
    };
    b2PositionSolverManifold.Initialize_s_pointA = new b2_math_js_1.b2Vec2();
    b2PositionSolverManifold.Initialize_s_pointB = new b2_math_js_1.b2Vec2();
    b2PositionSolverManifold.Initialize_s_planePoint = new b2_math_js_1.b2Vec2();
    b2PositionSolverManifold.Initialize_s_clipPoint = new b2_math_js_1.b2Vec2();
    return b2PositionSolverManifold;
}());
exports.b2PositionSolverManifold = b2PositionSolverManifold;
var b2ContactSolver = /** @class */ (function () {
    function b2ContactSolver() {
        this.m_step = new b2_time_step_js_1.b2TimeStep();
        this.m_positionConstraints = b2ContactPositionConstraint.MakeArray(1024); // TODO: b2Settings
        this.m_velocityConstraints = b2ContactVelocityConstraint.MakeArray(1024); // TODO: b2Settings
        this.m_count = 0;
    }
    b2ContactSolver.prototype.Initialize = function (def) {
        this.m_step.Copy(def.step);
        this.m_count = def.count;
        // TODO:
        if (this.m_positionConstraints.length < this.m_count) {
            var new_length = b2_math_js_1.b2Max(this.m_positionConstraints.length * 2, this.m_count);
            while (this.m_positionConstraints.length < new_length) {
                this.m_positionConstraints[this.m_positionConstraints.length] = new b2ContactPositionConstraint();
            }
        }
        // TODO:
        if (this.m_velocityConstraints.length < this.m_count) {
            var new_length = b2_math_js_1.b2Max(this.m_velocityConstraints.length * 2, this.m_count);
            while (this.m_velocityConstraints.length < new_length) {
                this.m_velocityConstraints[this.m_velocityConstraints.length] = new b2ContactVelocityConstraint();
            }
        }
        this.m_positions = def.positions;
        this.m_velocities = def.velocities;
        this.m_contacts = def.contacts;
        // Initialize position independent portions of the constraints.
        for (var i = 0; i < this.m_count; ++i) {
            var contact = this.m_contacts[i];
            var fixtureA = contact.m_fixtureA;
            var fixtureB = contact.m_fixtureB;
            var shapeA = fixtureA.GetShape();
            var shapeB = fixtureB.GetShape();
            var radiusA = shapeA.m_radius;
            var radiusB = shapeB.m_radius;
            var bodyA = fixtureA.GetBody();
            var bodyB = fixtureB.GetBody();
            var manifold = contact.GetManifold();
            var pointCount = manifold.pointCount;
            // DEBUG: b2Assert(pointCount > 0);
            var vc = this.m_velocityConstraints[i];
            vc.friction = contact.m_friction;
            vc.restitution = contact.m_restitution;
            vc.threshold = contact.m_restitutionThreshold;
            vc.tangentSpeed = contact.m_tangentSpeed;
            vc.indexA = bodyA.m_islandIndex;
            vc.indexB = bodyB.m_islandIndex;
            vc.invMassA = bodyA.m_invMass;
            vc.invMassB = bodyB.m_invMass;
            vc.invIA = bodyA.m_invI;
            vc.invIB = bodyB.m_invI;
            vc.contactIndex = i;
            vc.pointCount = pointCount;
            vc.K.SetZero();
            vc.normalMass.SetZero();
            var pc = this.m_positionConstraints[i];
            pc.indexA = bodyA.m_islandIndex;
            pc.indexB = bodyB.m_islandIndex;
            pc.invMassA = bodyA.m_invMass;
            pc.invMassB = bodyB.m_invMass;
            pc.localCenterA.Copy(bodyA.m_sweep.localCenter);
            pc.localCenterB.Copy(bodyB.m_sweep.localCenter);
            pc.invIA = bodyA.m_invI;
            pc.invIB = bodyB.m_invI;
            pc.localNormal.Copy(manifold.localNormal);
            pc.localPoint.Copy(manifold.localPoint);
            pc.pointCount = pointCount;
            pc.radiusA = radiusA;
            pc.radiusB = radiusB;
            pc.type = manifold.type;
            for (var j = 0; j < pointCount; ++j) {
                var cp = manifold.points[j];
                var vcp = vc.points[j];
                if (this.m_step.warmStarting) {
                    vcp.normalImpulse = this.m_step.dtRatio * cp.normalImpulse;
                    vcp.tangentImpulse = this.m_step.dtRatio * cp.tangentImpulse;
                }
                else {
                    vcp.normalImpulse = 0;
                    vcp.tangentImpulse = 0;
                }
                vcp.rA.SetZero();
                vcp.rB.SetZero();
                vcp.normalMass = 0;
                vcp.tangentMass = 0;
                vcp.velocityBias = 0;
                pc.localPoints[j].Copy(cp.localPoint);
            }
        }
        return this;
    };
    b2ContactSolver.prototype.InitializeVelocityConstraints = function () {
        var xfA = b2ContactSolver.InitializeVelocityConstraints_s_xfA;
        var xfB = b2ContactSolver.InitializeVelocityConstraints_s_xfB;
        var worldManifold = b2ContactSolver.InitializeVelocityConstraints_s_worldManifold;
        var k_maxConditionNumber = 1000;
        for (var i = 0; i < this.m_count; ++i) {
            var vc = this.m_velocityConstraints[i];
            var pc = this.m_positionConstraints[i];
            var radiusA = pc.radiusA;
            var radiusB = pc.radiusB;
            var manifold = this.m_contacts[vc.contactIndex].GetManifold();
            var indexA = vc.indexA;
            var indexB = vc.indexB;
            var mA = vc.invMassA;
            var mB = vc.invMassB;
            var iA = vc.invIA;
            var iB = vc.invIB;
            var localCenterA = pc.localCenterA;
            var localCenterB = pc.localCenterB;
            var cA = this.m_positions[indexA].c;
            var aA = this.m_positions[indexA].a;
            var vA = this.m_velocities[indexA].v;
            var wA = this.m_velocities[indexA].w;
            var cB = this.m_positions[indexB].c;
            var aB = this.m_positions[indexB].a;
            var vB = this.m_velocities[indexB].v;
            var wB = this.m_velocities[indexB].w;
            // DEBUG: b2Assert(manifold.pointCount > 0);
            xfA.q.SetAngle(aA);
            xfB.q.SetAngle(aB);
            b2_math_js_1.b2Vec2.SubVV(cA, b2_math_js_1.b2Rot.MulRV(xfA.q, localCenterA, b2_math_js_1.b2Vec2.s_t0), xfA.p);
            b2_math_js_1.b2Vec2.SubVV(cB, b2_math_js_1.b2Rot.MulRV(xfB.q, localCenterB, b2_math_js_1.b2Vec2.s_t0), xfB.p);
            worldManifold.Initialize(manifold, xfA, radiusA, xfB, radiusB);
            vc.normal.Copy(worldManifold.normal);
            b2_math_js_1.b2Vec2.CrossVOne(vc.normal, vc.tangent); // compute from normal
            var pointCount = vc.pointCount;
            for (var j = 0; j < pointCount; ++j) {
                var vcp = vc.points[j];
                // vcp->rA = worldManifold.points[j] - cA;
                b2_math_js_1.b2Vec2.SubVV(worldManifold.points[j], cA, vcp.rA);
                // vcp->rB = worldManifold.points[j] - cB;
                b2_math_js_1.b2Vec2.SubVV(worldManifold.points[j], cB, vcp.rB);
                var rnA = b2_math_js_1.b2Vec2.CrossVV(vcp.rA, vc.normal);
                var rnB = b2_math_js_1.b2Vec2.CrossVV(vcp.rB, vc.normal);
                var kNormal = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                vcp.normalMass = kNormal > 0 ? 1 / kNormal : 0;
                // b2Vec2 tangent = b2Cross(vc->normal, 1.0f);
                var tangent = vc.tangent; // precomputed from normal
                var rtA = b2_math_js_1.b2Vec2.CrossVV(vcp.rA, tangent);
                var rtB = b2_math_js_1.b2Vec2.CrossVV(vcp.rB, tangent);
                var kTangent = mA + mB + iA * rtA * rtA + iB * rtB * rtB;
                vcp.tangentMass = kTangent > 0 ? 1 / kTangent : 0;
                // Setup a velocity bias for restitution.
                vcp.velocityBias = 0;
                // float32 vRel = b2Dot(vc->normal, vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA));
                var vRel = b2_math_js_1.b2Vec2.DotVV(vc.normal, b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2_math_js_1.b2Vec2.s_t1), b2_math_js_1.b2Vec2.s_t0));
                if (vRel < -vc.threshold) {
                    vcp.velocityBias += (-vc.restitution * vRel);
                }
            }
            // If we have two points, then prepare the block solver.
            if (vc.pointCount === 2 && exports.g_blockSolve) {
                var vcp1 = vc.points[0];
                var vcp2 = vc.points[1];
                var rn1A = b2_math_js_1.b2Vec2.CrossVV(vcp1.rA, vc.normal);
                var rn1B = b2_math_js_1.b2Vec2.CrossVV(vcp1.rB, vc.normal);
                var rn2A = b2_math_js_1.b2Vec2.CrossVV(vcp2.rA, vc.normal);
                var rn2B = b2_math_js_1.b2Vec2.CrossVV(vcp2.rB, vc.normal);
                var k11 = mA + mB + iA * rn1A * rn1A + iB * rn1B * rn1B;
                var k22 = mA + mB + iA * rn2A * rn2A + iB * rn2B * rn2B;
                var k12 = mA + mB + iA * rn1A * rn2A + iB * rn1B * rn2B;
                // Ensure a reasonable condition number.
                // float32 k_maxConditionNumber = 1000.0f;
                if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
                    // K is safe to invert.
                    vc.K.ex.Set(k11, k12);
                    vc.K.ey.Set(k12, k22);
                    vc.K.GetInverse(vc.normalMass);
                }
                else {
                    // The constraints are redundant, just use one.
                    // TODO_ERIN use deepest?
                    vc.pointCount = 1;
                }
            }
        }
    };
    b2ContactSolver.prototype.WarmStart = function () {
        var P = b2ContactSolver.WarmStart_s_P;
        // Warm start.
        for (var i = 0; i < this.m_count; ++i) {
            var vc = this.m_velocityConstraints[i];
            var indexA = vc.indexA;
            var indexB = vc.indexB;
            var mA = vc.invMassA;
            var iA = vc.invIA;
            var mB = vc.invMassB;
            var iB = vc.invIB;
            var pointCount = vc.pointCount;
            var vA = this.m_velocities[indexA].v;
            var wA = this.m_velocities[indexA].w;
            var vB = this.m_velocities[indexB].v;
            var wB = this.m_velocities[indexB].w;
            var normal = vc.normal;
            // b2Vec2 tangent = b2Cross(normal, 1.0f);
            var tangent = vc.tangent; // precomputed from normal
            for (var j = 0; j < pointCount; ++j) {
                var vcp = vc.points[j];
                // b2Vec2 P = vcp->normalImpulse * normal + vcp->tangentImpulse * tangent;
                b2_math_js_1.b2Vec2.AddVV(b2_math_js_1.b2Vec2.MulSV(vcp.normalImpulse, normal, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.MulSV(vcp.tangentImpulse, tangent, b2_math_js_1.b2Vec2.s_t1), P);
                // wA -= iA * b2Cross(vcp->rA, P);
                wA -= iA * b2_math_js_1.b2Vec2.CrossVV(vcp.rA, P);
                // vA -= mA * P;
                vA.SelfMulSub(mA, P);
                // wB += iB * b2Cross(vcp->rB, P);
                wB += iB * b2_math_js_1.b2Vec2.CrossVV(vcp.rB, P);
                // vB += mB * P;
                vB.SelfMulAdd(mB, P);
            }
            // this.m_velocities[indexA].v = vA;
            this.m_velocities[indexA].w = wA;
            // this.m_velocities[indexB].v = vB;
            this.m_velocities[indexB].w = wB;
        }
    };
    b2ContactSolver.prototype.SolveVelocityConstraints = function () {
        var dv = b2ContactSolver.SolveVelocityConstraints_s_dv;
        var dv1 = b2ContactSolver.SolveVelocityConstraints_s_dv1;
        var dv2 = b2ContactSolver.SolveVelocityConstraints_s_dv2;
        var P = b2ContactSolver.SolveVelocityConstraints_s_P;
        var a = b2ContactSolver.SolveVelocityConstraints_s_a;
        var b = b2ContactSolver.SolveVelocityConstraints_s_b;
        var x = b2ContactSolver.SolveVelocityConstraints_s_x;
        var d = b2ContactSolver.SolveVelocityConstraints_s_d;
        var P1 = b2ContactSolver.SolveVelocityConstraints_s_P1;
        var P2 = b2ContactSolver.SolveVelocityConstraints_s_P2;
        var P1P2 = b2ContactSolver.SolveVelocityConstraints_s_P1P2;
        for (var i = 0; i < this.m_count; ++i) {
            var vc = this.m_velocityConstraints[i];
            var indexA = vc.indexA;
            var indexB = vc.indexB;
            var mA = vc.invMassA;
            var iA = vc.invIA;
            var mB = vc.invMassB;
            var iB = vc.invIB;
            var pointCount = vc.pointCount;
            var vA = this.m_velocities[indexA].v;
            var wA = this.m_velocities[indexA].w;
            var vB = this.m_velocities[indexB].v;
            var wB = this.m_velocities[indexB].w;
            // b2Vec2 normal = vc->normal;
            var normal = vc.normal;
            // b2Vec2 tangent = b2Cross(normal, 1.0f);
            var tangent = vc.tangent; // precomputed from normal
            var friction = vc.friction;
            // DEBUG: b2Assert(pointCount === 1 || pointCount === 2);
            // Solve tangent constraints first because non-penetration is more important
            // than friction.
            for (var j = 0; j < pointCount; ++j) {
                var vcp = vc.points[j];
                // Relative velocity at contact
                // b2Vec2 dv = vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA);
                b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2_math_js_1.b2Vec2.s_t1), dv);
                // Compute tangent force
                // float32 vt = b2Dot(dv, tangent) - vc->tangentSpeed;
                var vt = b2_math_js_1.b2Vec2.DotVV(dv, tangent) - vc.tangentSpeed;
                var lambda = vcp.tangentMass * (-vt);
                // b2Clamp the accumulated force
                var maxFriction = friction * vcp.normalImpulse;
                var newImpulse = b2_math_js_1.b2Clamp(vcp.tangentImpulse + lambda, (-maxFriction), maxFriction);
                lambda = newImpulse - vcp.tangentImpulse;
                vcp.tangentImpulse = newImpulse;
                // Apply contact impulse
                // b2Vec2 P = lambda * tangent;
                b2_math_js_1.b2Vec2.MulSV(lambda, tangent, P);
                // vA -= mA * P;
                vA.SelfMulSub(mA, P);
                // wA -= iA * b2Cross(vcp->rA, P);
                wA -= iA * b2_math_js_1.b2Vec2.CrossVV(vcp.rA, P);
                // vB += mB * P;
                vB.SelfMulAdd(mB, P);
                // wB += iB * b2Cross(vcp->rB, P);
                wB += iB * b2_math_js_1.b2Vec2.CrossVV(vcp.rB, P);
            }
            // Solve normal constraints
            if (vc.pointCount === 1 || exports.g_blockSolve === false) {
                for (var j = 0; j < pointCount; ++j) {
                    var vcp = vc.points[j];
                    // Relative velocity at contact
                    // b2Vec2 dv = vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA);
                    b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2_math_js_1.b2Vec2.s_t1), dv);
                    // Compute normal impulse
                    // float32 vn = b2Dot(dv, normal);
                    var vn = b2_math_js_1.b2Vec2.DotVV(dv, normal);
                    var lambda = (-vcp.normalMass * (vn - vcp.velocityBias));
                    // b2Clamp the accumulated impulse
                    // float32 newImpulse = b2Max(vcp->normalImpulse + lambda, 0.0f);
                    var newImpulse = b2_math_js_1.b2Max(vcp.normalImpulse + lambda, 0);
                    lambda = newImpulse - vcp.normalImpulse;
                    vcp.normalImpulse = newImpulse;
                    // Apply contact impulse
                    // b2Vec2 P = lambda * normal;
                    b2_math_js_1.b2Vec2.MulSV(lambda, normal, P);
                    // vA -= mA * P;
                    vA.SelfMulSub(mA, P);
                    // wA -= iA * b2Cross(vcp->rA, P);
                    wA -= iA * b2_math_js_1.b2Vec2.CrossVV(vcp.rA, P);
                    // vB += mB * P;
                    vB.SelfMulAdd(mB, P);
                    // wB += iB * b2Cross(vcp->rB, P);
                    wB += iB * b2_math_js_1.b2Vec2.CrossVV(vcp.rB, P);
                }
            }
            else {
                // Block solver developed in collaboration with Dirk Gregorius (back in 01/07 on Box2D_Lite).
                // Build the mini LCP for this contact patch
                //
                // vn = A * x + b, vn >= 0, x >= 0 and vn_i * x_i = 0 with i = 1..2
                //
                // A = J * W * JT and J = ( -n, -r1 x n, n, r2 x n )
                // b = vn0 - velocityBias
                //
                // The system is solved using the "Total enumeration method" (s. Murty). The complementary constraint vn_i * x_i
                // implies that we must have in any solution either vn_i = 0 or x_i = 0. So for the 2D contact problem the cases
                // vn1 = 0 and vn2 = 0, x1 = 0 and x2 = 0, x1 = 0 and vn2 = 0, x2 = 0 and vn1 = 0 need to be tested. The first valid
                // solution that satisfies the problem is chosen.
                //
                // In order to account of the accumulated impulse 'a' (because of the iterative nature of the solver which only requires
                // that the accumulated impulse is clamped and not the incremental impulse) we change the impulse variable (x_i).
                //
                // Substitute:
                //
                // x = a + d
                //
                // a := old total impulse
                // x := new total impulse
                // d := incremental impulse
                //
                // For the current iteration we extend the formula for the incremental impulse
                // to compute the new total impulse:
                //
                // vn = A * d + b
                //    = A * (x - a) + b
                //    = A * x + b - A * a
                //    = A * x + b'
                // b' = b - A * a;
                var cp1 = vc.points[0];
                var cp2 = vc.points[1];
                // b2Vec2 a(cp1->normalImpulse, cp2->normalImpulse);
                a.Set(cp1.normalImpulse, cp2.normalImpulse);
                // DEBUG: b2Assert(a.x >= 0 && a.y >= 0);
                // Relative velocity at contact
                // b2Vec2 dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVCrossSV(vB, wB, cp1.rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVCrossSV(vA, wA, cp1.rA, b2_math_js_1.b2Vec2.s_t1), dv1);
                // b2Vec2 dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVCrossSV(vB, wB, cp2.rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVCrossSV(vA, wA, cp2.rA, b2_math_js_1.b2Vec2.s_t1), dv2);
                // Compute normal velocity
                // float32 vn1 = b2Dot(dv1, normal);
                var vn1 = b2_math_js_1.b2Vec2.DotVV(dv1, normal);
                // float32 vn2 = b2Dot(dv2, normal);
                var vn2 = b2_math_js_1.b2Vec2.DotVV(dv2, normal);
                // b2Vec2 b;
                b.x = vn1 - cp1.velocityBias;
                b.y = vn2 - cp2.velocityBias;
                // Compute b'
                // b -= b2Mul(vc->K, a);
                b.SelfSub(b2_math_js_1.b2Mat22.MulMV(vc.K, a, b2_math_js_1.b2Vec2.s_t0));
                /*
                #if B2_DEBUG_SOLVER === 1
                const k_errorTol: number = 0.001;
                #endif
                */
                for (;;) {
                    //
                    // Case 1: vn = 0
                    //
                    // 0 = A * x + b'
                    //
                    // Solve for x:
                    //
                    // x = - inv(A) * b'
                    //
                    // b2Vec2 x = - b2Mul(vc->normalMass, b);
                    b2_math_js_1.b2Mat22.MulMV(vc.normalMass, b, x).SelfNeg();
                    if (x.x >= 0 && x.y >= 0) {
                        // Get the incremental impulse
                        // b2Vec2 d = x - a;
                        b2_math_js_1.b2Vec2.SubVV(x, a, d);
                        // Apply incremental impulse
                        // b2Vec2 P1 = d.x * normal;
                        b2_math_js_1.b2Vec2.MulSV(d.x, normal, P1);
                        // b2Vec2 P2 = d.y * normal;
                        b2_math_js_1.b2Vec2.MulSV(d.y, normal, P2);
                        b2_math_js_1.b2Vec2.AddVV(P1, P2, P1P2);
                        // vA -= mA * (P1 + P2);
                        vA.SelfMulSub(mA, P1P2);
                        // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                        wA -= iA * (b2_math_js_1.b2Vec2.CrossVV(cp1.rA, P1) + b2_math_js_1.b2Vec2.CrossVV(cp2.rA, P2));
                        // vB += mB * (P1 + P2);
                        vB.SelfMulAdd(mB, P1P2);
                        // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                        wB += iB * (b2_math_js_1.b2Vec2.CrossVV(cp1.rB, P1) + b2_math_js_1.b2Vec2.CrossVV(cp2.rB, P2));
                        // Accumulate
                        cp1.normalImpulse = x.x;
                        cp2.normalImpulse = x.y;
                        /*
                        #if B2_DEBUG_SOLVER === 1
                        // Postconditions
                        dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                        dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
            
                        // Compute normal velocity
                        vn1 = b2Dot(dv1, normal);
                        vn2 = b2Dot(dv2, normal);
            
                        b2Assert(b2Abs(vn1 - cp1->velocityBias) < k_errorTol);
                        b2Assert(b2Abs(vn2 - cp2->velocityBias) < k_errorTol);
                        #endif
                        */
                        break;
                    }
                    //
                    // Case 2: vn1 = 0 and x2 = 0
                    //
                    //   0 = a11 * x1 + a12 * 0 + b1'
                    // vn2 = a21 * x1 + a22 * 0 + b2'
                    //
                    x.x = (-cp1.normalMass * b.x);
                    x.y = 0;
                    vn1 = 0;
                    vn2 = vc.K.ex.y * x.x + b.y;
                    if (x.x >= 0 && vn2 >= 0) {
                        // Get the incremental impulse
                        // b2Vec2 d = x - a;
                        b2_math_js_1.b2Vec2.SubVV(x, a, d);
                        // Apply incremental impulse
                        // b2Vec2 P1 = d.x * normal;
                        b2_math_js_1.b2Vec2.MulSV(d.x, normal, P1);
                        // b2Vec2 P2 = d.y * normal;
                        b2_math_js_1.b2Vec2.MulSV(d.y, normal, P2);
                        b2_math_js_1.b2Vec2.AddVV(P1, P2, P1P2);
                        // vA -= mA * (P1 + P2);
                        vA.SelfMulSub(mA, P1P2);
                        // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                        wA -= iA * (b2_math_js_1.b2Vec2.CrossVV(cp1.rA, P1) + b2_math_js_1.b2Vec2.CrossVV(cp2.rA, P2));
                        // vB += mB * (P1 + P2);
                        vB.SelfMulAdd(mB, P1P2);
                        // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                        wB += iB * (b2_math_js_1.b2Vec2.CrossVV(cp1.rB, P1) + b2_math_js_1.b2Vec2.CrossVV(cp2.rB, P2));
                        // Accumulate
                        cp1.normalImpulse = x.x;
                        cp2.normalImpulse = x.y;
                        /*
                        #if B2_DEBUG_SOLVER === 1
                        // Postconditions
                        dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
            
                        // Compute normal velocity
                        vn1 = b2Dot(dv1, normal);
            
                        b2Assert(b2Abs(vn1 - cp1->velocityBias) < k_errorTol);
                        #endif
                        */
                        break;
                    }
                    //
                    // Case 3: vn2 = 0 and x1 = 0
                    //
                    // vn1 = a11 * 0 + a12 * x2 + b1'
                    //   0 = a21 * 0 + a22 * x2 + b2'
                    //
                    x.x = 0;
                    x.y = (-cp2.normalMass * b.y);
                    vn1 = vc.K.ey.x * x.y + b.x;
                    vn2 = 0;
                    if (x.y >= 0 && vn1 >= 0) {
                        // Resubstitute for the incremental impulse
                        // b2Vec2 d = x - a;
                        b2_math_js_1.b2Vec2.SubVV(x, a, d);
                        // Apply incremental impulse
                        // b2Vec2 P1 = d.x * normal;
                        b2_math_js_1.b2Vec2.MulSV(d.x, normal, P1);
                        // b2Vec2 P2 = d.y * normal;
                        b2_math_js_1.b2Vec2.MulSV(d.y, normal, P2);
                        b2_math_js_1.b2Vec2.AddVV(P1, P2, P1P2);
                        // vA -= mA * (P1 + P2);
                        vA.SelfMulSub(mA, P1P2);
                        // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                        wA -= iA * (b2_math_js_1.b2Vec2.CrossVV(cp1.rA, P1) + b2_math_js_1.b2Vec2.CrossVV(cp2.rA, P2));
                        // vB += mB * (P1 + P2);
                        vB.SelfMulAdd(mB, P1P2);
                        // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                        wB += iB * (b2_math_js_1.b2Vec2.CrossVV(cp1.rB, P1) + b2_math_js_1.b2Vec2.CrossVV(cp2.rB, P2));
                        // Accumulate
                        cp1.normalImpulse = x.x;
                        cp2.normalImpulse = x.y;
                        /*
                        #if B2_DEBUG_SOLVER === 1
                        // Postconditions
                        dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
            
                        // Compute normal velocity
                        vn2 = b2Dot(dv2, normal);
            
                        b2Assert(b2Abs(vn2 - cp2->velocityBias) < k_errorTol);
                        #endif
                        */
                        break;
                    }
                    //
                    // Case 4: x1 = 0 and x2 = 0
                    //
                    // vn1 = b1
                    // vn2 = b2;
                    x.x = 0;
                    x.y = 0;
                    vn1 = b.x;
                    vn2 = b.y;
                    if (vn1 >= 0 && vn2 >= 0) {
                        // Resubstitute for the incremental impulse
                        // b2Vec2 d = x - a;
                        b2_math_js_1.b2Vec2.SubVV(x, a, d);
                        // Apply incremental impulse
                        // b2Vec2 P1 = d.x * normal;
                        b2_math_js_1.b2Vec2.MulSV(d.x, normal, P1);
                        // b2Vec2 P2 = d.y * normal;
                        b2_math_js_1.b2Vec2.MulSV(d.y, normal, P2);
                        b2_math_js_1.b2Vec2.AddVV(P1, P2, P1P2);
                        // vA -= mA * (P1 + P2);
                        vA.SelfMulSub(mA, P1P2);
                        // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                        wA -= iA * (b2_math_js_1.b2Vec2.CrossVV(cp1.rA, P1) + b2_math_js_1.b2Vec2.CrossVV(cp2.rA, P2));
                        // vB += mB * (P1 + P2);
                        vB.SelfMulAdd(mB, P1P2);
                        // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                        wB += iB * (b2_math_js_1.b2Vec2.CrossVV(cp1.rB, P1) + b2_math_js_1.b2Vec2.CrossVV(cp2.rB, P2));
                        // Accumulate
                        cp1.normalImpulse = x.x;
                        cp2.normalImpulse = x.y;
                        break;
                    }
                    // No solution, give up. This is hit sometimes, but it doesn't seem to matter.
                    break;
                }
            }
            // this.m_velocities[indexA].v = vA;
            this.m_velocities[indexA].w = wA;
            // this.m_velocities[indexB].v = vB;
            this.m_velocities[indexB].w = wB;
        }
    };
    b2ContactSolver.prototype.StoreImpulses = function () {
        for (var i = 0; i < this.m_count; ++i) {
            var vc = this.m_velocityConstraints[i];
            var manifold = this.m_contacts[vc.contactIndex].GetManifold();
            for (var j = 0; j < vc.pointCount; ++j) {
                manifold.points[j].normalImpulse = vc.points[j].normalImpulse;
                manifold.points[j].tangentImpulse = vc.points[j].tangentImpulse;
            }
        }
    };
    b2ContactSolver.prototype.SolvePositionConstraints = function () {
        var xfA = b2ContactSolver.SolvePositionConstraints_s_xfA;
        var xfB = b2ContactSolver.SolvePositionConstraints_s_xfB;
        var psm = b2ContactSolver.SolvePositionConstraints_s_psm;
        var rA = b2ContactSolver.SolvePositionConstraints_s_rA;
        var rB = b2ContactSolver.SolvePositionConstraints_s_rB;
        var P = b2ContactSolver.SolvePositionConstraints_s_P;
        var minSeparation = 0;
        for (var i = 0; i < this.m_count; ++i) {
            var pc = this.m_positionConstraints[i];
            var indexA = pc.indexA;
            var indexB = pc.indexB;
            var localCenterA = pc.localCenterA;
            var mA = pc.invMassA;
            var iA = pc.invIA;
            var localCenterB = pc.localCenterB;
            var mB = pc.invMassB;
            var iB = pc.invIB;
            var pointCount = pc.pointCount;
            var cA = this.m_positions[indexA].c;
            var aA = this.m_positions[indexA].a;
            var cB = this.m_positions[indexB].c;
            var aB = this.m_positions[indexB].a;
            // Solve normal constraints
            for (var j = 0; j < pointCount; ++j) {
                xfA.q.SetAngle(aA);
                xfB.q.SetAngle(aB);
                b2_math_js_1.b2Vec2.SubVV(cA, b2_math_js_1.b2Rot.MulRV(xfA.q, localCenterA, b2_math_js_1.b2Vec2.s_t0), xfA.p);
                b2_math_js_1.b2Vec2.SubVV(cB, b2_math_js_1.b2Rot.MulRV(xfB.q, localCenterB, b2_math_js_1.b2Vec2.s_t0), xfB.p);
                psm.Initialize(pc, xfA, xfB, j);
                var normal = psm.normal;
                var point = psm.point;
                var separation = psm.separation;
                // b2Vec2 rA = point - cA;
                b2_math_js_1.b2Vec2.SubVV(point, cA, rA);
                // b2Vec2 rB = point - cB;
                b2_math_js_1.b2Vec2.SubVV(point, cB, rB);
                // Track max constraint error.
                minSeparation = b2_math_js_1.b2Min(minSeparation, separation);
                // Prevent large corrections and allow slop.
                var C = b2_math_js_1.b2Clamp(b2_settings_js_1.b2_baumgarte * (separation + b2_settings_js_1.b2_linearSlop), (-b2_settings_js_1.b2_maxLinearCorrection), 0);
                // Compute the effective mass.
                // float32 rnA = b2Cross(rA, normal);
                var rnA = b2_math_js_1.b2Vec2.CrossVV(rA, normal);
                // float32 rnB = b2Cross(rB, normal);
                var rnB = b2_math_js_1.b2Vec2.CrossVV(rB, normal);
                // float32 K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                var K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                // Compute normal impulse
                var impulse = K > 0 ? -C / K : 0;
                // b2Vec2 P = impulse * normal;
                b2_math_js_1.b2Vec2.MulSV(impulse, normal, P);
                // cA -= mA * P;
                cA.SelfMulSub(mA, P);
                // aA -= iA * b2Cross(rA, P);
                aA -= iA * b2_math_js_1.b2Vec2.CrossVV(rA, P);
                // cB += mB * P;
                cB.SelfMulAdd(mB, P);
                // aB += iB * b2Cross(rB, P);
                aB += iB * b2_math_js_1.b2Vec2.CrossVV(rB, P);
            }
            // this.m_positions[indexA].c = cA;
            this.m_positions[indexA].a = aA;
            // this.m_positions[indexB].c = cB;
            this.m_positions[indexB].a = aB;
        }
        // We can't expect minSpeparation >= -b2_linearSlop because we don't
        // push the separation above -b2_linearSlop.
        return minSeparation > (-3 * b2_settings_js_1.b2_linearSlop);
    };
    b2ContactSolver.prototype.SolveTOIPositionConstraints = function (toiIndexA, toiIndexB) {
        var xfA = b2ContactSolver.SolveTOIPositionConstraints_s_xfA;
        var xfB = b2ContactSolver.SolveTOIPositionConstraints_s_xfB;
        var psm = b2ContactSolver.SolveTOIPositionConstraints_s_psm;
        var rA = b2ContactSolver.SolveTOIPositionConstraints_s_rA;
        var rB = b2ContactSolver.SolveTOIPositionConstraints_s_rB;
        var P = b2ContactSolver.SolveTOIPositionConstraints_s_P;
        var minSeparation = 0;
        for (var i = 0; i < this.m_count; ++i) {
            var pc = this.m_positionConstraints[i];
            var indexA = pc.indexA;
            var indexB = pc.indexB;
            var localCenterA = pc.localCenterA;
            var localCenterB = pc.localCenterB;
            var pointCount = pc.pointCount;
            var mA = 0;
            var iA = 0;
            if (indexA === toiIndexA || indexA === toiIndexB) {
                mA = pc.invMassA;
                iA = pc.invIA;
            }
            var mB = 0;
            var iB = 0;
            if (indexB === toiIndexA || indexB === toiIndexB) {
                mB = pc.invMassB;
                iB = pc.invIB;
            }
            var cA = this.m_positions[indexA].c;
            var aA = this.m_positions[indexA].a;
            var cB = this.m_positions[indexB].c;
            var aB = this.m_positions[indexB].a;
            // Solve normal constraints
            for (var j = 0; j < pointCount; ++j) {
                xfA.q.SetAngle(aA);
                xfB.q.SetAngle(aB);
                b2_math_js_1.b2Vec2.SubVV(cA, b2_math_js_1.b2Rot.MulRV(xfA.q, localCenterA, b2_math_js_1.b2Vec2.s_t0), xfA.p);
                b2_math_js_1.b2Vec2.SubVV(cB, b2_math_js_1.b2Rot.MulRV(xfB.q, localCenterB, b2_math_js_1.b2Vec2.s_t0), xfB.p);
                psm.Initialize(pc, xfA, xfB, j);
                var normal = psm.normal;
                var point = psm.point;
                var separation = psm.separation;
                // b2Vec2 rA = point - cA;
                b2_math_js_1.b2Vec2.SubVV(point, cA, rA);
                // b2Vec2 rB = point - cB;
                b2_math_js_1.b2Vec2.SubVV(point, cB, rB);
                // Track max constraint error.
                minSeparation = b2_math_js_1.b2Min(minSeparation, separation);
                // Prevent large corrections and allow slop.
                var C = b2_math_js_1.b2Clamp(b2_settings_js_1.b2_toiBaumgarte * (separation + b2_settings_js_1.b2_linearSlop), (-b2_settings_js_1.b2_maxLinearCorrection), 0);
                // Compute the effective mass.
                // float32 rnA = b2Cross(rA, normal);
                var rnA = b2_math_js_1.b2Vec2.CrossVV(rA, normal);
                // float32 rnB = b2Cross(rB, normal);
                var rnB = b2_math_js_1.b2Vec2.CrossVV(rB, normal);
                // float32 K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                var K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                // Compute normal impulse
                var impulse = K > 0 ? -C / K : 0;
                // b2Vec2 P = impulse * normal;
                b2_math_js_1.b2Vec2.MulSV(impulse, normal, P);
                // cA -= mA * P;
                cA.SelfMulSub(mA, P);
                // aA -= iA * b2Cross(rA, P);
                aA -= iA * b2_math_js_1.b2Vec2.CrossVV(rA, P);
                // cB += mB * P;
                cB.SelfMulAdd(mB, P);
                // aB += iB * b2Cross(rB, P);
                aB += iB * b2_math_js_1.b2Vec2.CrossVV(rB, P);
            }
            // this.m_positions[indexA].c = cA;
            this.m_positions[indexA].a = aA;
            // this.m_positions[indexB].c = cB;
            this.m_positions[indexB].a = aB;
        }
        // We can't expect minSpeparation >= -b2_linearSlop because we don't
        // push the separation above -b2_linearSlop.
        return minSeparation >= -1.5 * b2_settings_js_1.b2_linearSlop;
    };
    b2ContactSolver.InitializeVelocityConstraints_s_xfA = new b2_math_js_1.b2Transform();
    b2ContactSolver.InitializeVelocityConstraints_s_xfB = new b2_math_js_1.b2Transform();
    b2ContactSolver.InitializeVelocityConstraints_s_worldManifold = new b2_collision_js_1.b2WorldManifold();
    b2ContactSolver.WarmStart_s_P = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveVelocityConstraints_s_dv = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveVelocityConstraints_s_dv1 = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveVelocityConstraints_s_dv2 = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveVelocityConstraints_s_P = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveVelocityConstraints_s_a = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveVelocityConstraints_s_b = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveVelocityConstraints_s_x = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveVelocityConstraints_s_d = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveVelocityConstraints_s_P1 = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveVelocityConstraints_s_P2 = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveVelocityConstraints_s_P1P2 = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolvePositionConstraints_s_xfA = new b2_math_js_1.b2Transform();
    b2ContactSolver.SolvePositionConstraints_s_xfB = new b2_math_js_1.b2Transform();
    b2ContactSolver.SolvePositionConstraints_s_psm = new b2PositionSolverManifold();
    b2ContactSolver.SolvePositionConstraints_s_rA = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolvePositionConstraints_s_rB = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolvePositionConstraints_s_P = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveTOIPositionConstraints_s_xfA = new b2_math_js_1.b2Transform();
    b2ContactSolver.SolveTOIPositionConstraints_s_xfB = new b2_math_js_1.b2Transform();
    b2ContactSolver.SolveTOIPositionConstraints_s_psm = new b2PositionSolverManifold();
    b2ContactSolver.SolveTOIPositionConstraints_s_rA = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveTOIPositionConstraints_s_rB = new b2_math_js_1.b2Vec2();
    b2ContactSolver.SolveTOIPositionConstraints_s_P = new b2_math_js_1.b2Vec2();
    return b2ContactSolver;
}());
exports.b2ContactSolver = b2ContactSolver;
