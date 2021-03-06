"use strict";
/*
 * Copyright (c) 2013 Google, Inc.
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
exports.b2ParticleGroup = exports.b2ParticleGroupDef = exports.b2ParticleGroupFlag = void 0;
// #if B2_ENABLE_PARTICLE
// DEBUG: import { b2Assert } from "../common/b2_settings";
var b2_math_js_1 = require("../common/b2_math.js");
var b2_draw_js_1 = require("../common/b2_draw.js");
var b2ParticleGroupFlag;
(function (b2ParticleGroupFlag) {
    /// Prevents overlapping or leaking.
    b2ParticleGroupFlag[b2ParticleGroupFlag["b2_solidParticleGroup"] = 1] = "b2_solidParticleGroup";
    /// Keeps its shape.
    b2ParticleGroupFlag[b2ParticleGroupFlag["b2_rigidParticleGroup"] = 2] = "b2_rigidParticleGroup";
    /// Won't be destroyed if it gets empty.
    b2ParticleGroupFlag[b2ParticleGroupFlag["b2_particleGroupCanBeEmpty"] = 4] = "b2_particleGroupCanBeEmpty";
    /// Will be destroyed on next simulation step.
    b2ParticleGroupFlag[b2ParticleGroupFlag["b2_particleGroupWillBeDestroyed"] = 8] = "b2_particleGroupWillBeDestroyed";
    /// Updates depth data on next simulation step.
    b2ParticleGroupFlag[b2ParticleGroupFlag["b2_particleGroupNeedsUpdateDepth"] = 16] = "b2_particleGroupNeedsUpdateDepth";
    b2ParticleGroupFlag[b2ParticleGroupFlag["b2_particleGroupInternalMask"] = 24] = "b2_particleGroupInternalMask";
})(b2ParticleGroupFlag = exports.b2ParticleGroupFlag || (exports.b2ParticleGroupFlag = {}));
var b2ParticleGroupDef = /** @class */ (function () {
    function b2ParticleGroupDef() {
        this.flags = 0;
        this.groupFlags = 0;
        this.position = new b2_math_js_1.b2Vec2();
        this.angle = 0.0;
        this.linearVelocity = new b2_math_js_1.b2Vec2();
        this.angularVelocity = 0.0;
        this.color = new b2_draw_js_1.b2Color();
        this.strength = 1.0;
        this.shapeCount = 0;
        this.stride = 0;
        this.particleCount = 0;
        this.lifetime = 0;
        this.userData = null;
        this.group = null;
    }
    return b2ParticleGroupDef;
}());
exports.b2ParticleGroupDef = b2ParticleGroupDef;
var b2ParticleGroup = /** @class */ (function () {
    function b2ParticleGroup(system) {
        this.m_firstIndex = 0;
        this.m_lastIndex = 0;
        this.m_groupFlags = 0;
        this.m_strength = 1.0;
        this.m_prev = null;
        this.m_next = null;
        this.m_timestamp = -1;
        this.m_mass = 0.0;
        this.m_inertia = 0.0;
        this.m_center = new b2_math_js_1.b2Vec2();
        this.m_linearVelocity = new b2_math_js_1.b2Vec2();
        this.m_angularVelocity = 0.0;
        this.m_transform = new b2_math_js_1.b2Transform();
        ///m_transform.SetIdentity();
        this.m_userData = null;
        this.m_system = system;
    }
    b2ParticleGroup.prototype.GetNext = function () {
        return this.m_next;
    };
    b2ParticleGroup.prototype.GetParticleSystem = function () {
        return this.m_system;
    };
    b2ParticleGroup.prototype.GetParticleCount = function () {
        return this.m_lastIndex - this.m_firstIndex;
    };
    b2ParticleGroup.prototype.GetBufferIndex = function () {
        return this.m_firstIndex;
    };
    b2ParticleGroup.prototype.ContainsParticle = function (index) {
        return this.m_firstIndex <= index && index < this.m_lastIndex;
    };
    b2ParticleGroup.prototype.GetAllParticleFlags = function () {
        if (!this.m_system.m_flagsBuffer.data) {
            throw new Error();
        }
        var flags = 0;
        for (var i = this.m_firstIndex; i < this.m_lastIndex; i++) {
            flags |= this.m_system.m_flagsBuffer.data[i];
        }
        return flags;
    };
    b2ParticleGroup.prototype.GetGroupFlags = function () {
        return this.m_groupFlags;
    };
    b2ParticleGroup.prototype.SetGroupFlags = function (flags) {
        // DEBUG: b2Assert((flags & b2ParticleGroupFlag.b2_particleGroupInternalMask) === 0);
        flags |= this.m_groupFlags & b2ParticleGroupFlag.b2_particleGroupInternalMask;
        this.m_system.SetGroupFlags(this, flags);
    };
    b2ParticleGroup.prototype.GetMass = function () {
        this.UpdateStatistics();
        return this.m_mass;
    };
    b2ParticleGroup.prototype.GetInertia = function () {
        this.UpdateStatistics();
        return this.m_inertia;
    };
    b2ParticleGroup.prototype.GetCenter = function () {
        this.UpdateStatistics();
        return this.m_center;
    };
    b2ParticleGroup.prototype.GetLinearVelocity = function () {
        this.UpdateStatistics();
        return this.m_linearVelocity;
    };
    b2ParticleGroup.prototype.GetAngularVelocity = function () {
        this.UpdateStatistics();
        return this.m_angularVelocity;
    };
    b2ParticleGroup.prototype.GetTransform = function () {
        return this.m_transform;
    };
    b2ParticleGroup.prototype.GetPosition = function () {
        return this.m_transform.p;
    };
    b2ParticleGroup.prototype.GetAngle = function () {
        return this.m_transform.q.GetAngle();
    };
    b2ParticleGroup.prototype.GetLinearVelocityFromWorldPoint = function (worldPoint, out) {
        var s_t0 = b2ParticleGroup.GetLinearVelocityFromWorldPoint_s_t0;
        this.UpdateStatistics();
        ///  return m_linearVelocity + b2Cross(m_angularVelocity, worldPoint - m_center);
        return b2_math_js_1.b2Vec2.AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2_math_js_1.b2Vec2.SubVV(worldPoint, this.m_center, s_t0), out);
    };
    b2ParticleGroup.prototype.GetUserData = function () {
        return this.m_userData;
    };
    b2ParticleGroup.prototype.SetUserData = function (data) {
        this.m_userData = data;
    };
    b2ParticleGroup.prototype.ApplyForce = function (force) {
        this.m_system.ApplyForce(this.m_firstIndex, this.m_lastIndex, force);
    };
    b2ParticleGroup.prototype.ApplyLinearImpulse = function (impulse) {
        this.m_system.ApplyLinearImpulse(this.m_firstIndex, this.m_lastIndex, impulse);
    };
    b2ParticleGroup.prototype.DestroyParticles = function (callDestructionListener) {
        if (this.m_system.m_world.IsLocked()) {
            throw new Error();
        }
        for (var i = this.m_firstIndex; i < this.m_lastIndex; i++) {
            this.m_system.DestroyParticle(i, callDestructionListener);
        }
    };
    b2ParticleGroup.prototype.UpdateStatistics = function () {
        if (!this.m_system.m_positionBuffer.data) {
            throw new Error();
        }
        if (!this.m_system.m_velocityBuffer.data) {
            throw new Error();
        }
        var p = new b2_math_js_1.b2Vec2();
        var v = new b2_math_js_1.b2Vec2();
        if (this.m_timestamp !== this.m_system.m_timestamp) {
            var m = this.m_system.GetParticleMass();
            ///  this.m_mass = 0;
            this.m_mass = m * (this.m_lastIndex - this.m_firstIndex);
            this.m_center.SetZero();
            this.m_linearVelocity.SetZero();
            for (var i = this.m_firstIndex; i < this.m_lastIndex; i++) {
                ///  this.m_mass += m;
                ///  this.m_center += m * this.m_system.m_positionBuffer.data[i];
                this.m_center.SelfMulAdd(m, this.m_system.m_positionBuffer.data[i]);
                ///  this.m_linearVelocity += m * this.m_system.m_velocityBuffer.data[i];
                this.m_linearVelocity.SelfMulAdd(m, this.m_system.m_velocityBuffer.data[i]);
            }
            if (this.m_mass > 0) {
                var inv_mass = 1 / this.m_mass;
                ///this.m_center *= 1 / this.m_mass;
                this.m_center.SelfMul(inv_mass);
                ///this.m_linearVelocity *= 1 / this.m_mass;
                this.m_linearVelocity.SelfMul(inv_mass);
            }
            this.m_inertia = 0;
            this.m_angularVelocity = 0;
            for (var i = this.m_firstIndex; i < this.m_lastIndex; i++) {
                ///b2Vec2 p = this.m_system.m_positionBuffer.data[i] - this.m_center;
                b2_math_js_1.b2Vec2.SubVV(this.m_system.m_positionBuffer.data[i], this.m_center, p);
                ///b2Vec2 v = this.m_system.m_velocityBuffer.data[i] - this.m_linearVelocity;
                b2_math_js_1.b2Vec2.SubVV(this.m_system.m_velocityBuffer.data[i], this.m_linearVelocity, v);
                this.m_inertia += m * b2_math_js_1.b2Vec2.DotVV(p, p);
                this.m_angularVelocity += m * b2_math_js_1.b2Vec2.CrossVV(p, v);
            }
            if (this.m_inertia > 0) {
                this.m_angularVelocity *= 1 / this.m_inertia;
            }
            this.m_timestamp = this.m_system.m_timestamp;
        }
    };
    b2ParticleGroup.GetLinearVelocityFromWorldPoint_s_t0 = new b2_math_js_1.b2Vec2();
    return b2ParticleGroup;
}());
exports.b2ParticleGroup = b2ParticleGroup;
// #endif
