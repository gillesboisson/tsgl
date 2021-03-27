"use strict";
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
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
exports.b2World = void 0;
// DEBUG: import { b2Assert } from "../common/b2_settings";
var b2_settings_js_1 = require("../common/b2_settings.js");
var b2_math_js_1 = require("../common/b2_math.js");
var b2_timer_js_1 = require("../common/b2_timer.js");
var b2_draw_js_1 = require("../common/b2_draw.js");
var b2_collision_js_1 = require("../collision/b2_collision.js");
var b2_time_of_impact_js_1 = require("../collision/b2_time_of_impact.js");
var b2_shape_js_1 = require("../collision/b2_shape.js");
var b2_joint_js_1 = require("./b2_joint.js");
var b2_area_joint_js_1 = require("./b2_area_joint.js");
var b2_distance_joint_js_1 = require("./b2_distance_joint.js");
var b2_friction_joint_js_1 = require("./b2_friction_joint.js");
var b2_gear_joint_js_1 = require("./b2_gear_joint.js");
var b2_motor_joint_js_1 = require("./b2_motor_joint.js");
var b2_mouse_joint_js_1 = require("./b2_mouse_joint.js");
var b2_prismatic_joint_js_1 = require("./b2_prismatic_joint.js");
var b2_pulley_joint_js_1 = require("./b2_pulley_joint.js");
var b2_revolute_joint_js_1 = require("./b2_revolute_joint.js");
var b2_weld_joint_js_1 = require("./b2_weld_joint.js");
var b2_wheel_joint_js_1 = require("./b2_wheel_joint.js");
var b2_body_js_1 = require("./b2_body.js");
var b2_contact_manager_js_1 = require("./b2_contact_manager.js");
var b2_island_js_1 = require("./b2_island.js");
var b2_time_step_js_1 = require("./b2_time_step.js");
var b2_world_callbacks_js_1 = require("./b2_world_callbacks.js");
var b2_world_callbacks_js_2 = require("./b2_world_callbacks.js");
// #if B2_ENABLE_PARTICLE
var b2_settings_js_2 = require("../common/b2_settings.js");
var b2_particle_js_1 = require("../particle/b2_particle.js");
var b2_particle_system_js_1 = require("../particle/b2_particle_system.js");
// #endif
/// The world class manages all physics entities, dynamic simulation,
/// and asynchronous queries. The world also contains efficient memory
/// management facilities.
var b2World = /** @class */ (function () {
    // #endif
    /// Construct a world object.
    /// @param gravity the world gravity vector.
    function b2World(gravity) {
        this.m_contactManager = new b2_contact_manager_js_1.b2ContactManager();
        this.m_bodyList = null;
        this.m_jointList = null;
        // #if B2_ENABLE_PARTICLE
        this.m_particleSystemList = null;
        // #endif
        this.m_bodyCount = 0;
        this.m_jointCount = 0;
        this.m_gravity = new b2_math_js_1.b2Vec2();
        this.m_allowSleep = true;
        this.m_destructionListener = null;
        this.m_debugDraw = null;
        // This is used to compute the time step ratio to
        // support a variable time step.
        this.m_inv_dt0 = 0;
        this.m_newContacts = false;
        this.m_locked = false;
        this.m_clearForces = true;
        // These are for debugging the solver.
        this.m_warmStarting = true;
        this.m_continuousPhysics = true;
        this.m_subStepping = false;
        this.m_stepComplete = true;
        this.m_profile = new b2_time_step_js_1.b2Profile();
        this.m_island = new b2_island_js_1.b2Island();
        this.s_stack = [];
        // #if B2_ENABLE_CONTROLLER
        this.m_controllerList = null;
        this.m_controllerCount = 0;
        this.m_gravity.Copy(gravity);
    }
    /// Register a destruction listener. The listener is owned by you and must
    /// remain in scope.
    b2World.prototype.SetDestructionListener = function (listener) {
        this.m_destructionListener = listener;
    };
    /// Register a contact filter to provide specific control over collision.
    /// Otherwise the default filter is used (b2_defaultFilter). The listener is
    /// owned by you and must remain in scope.
    b2World.prototype.SetContactFilter = function (filter) {
        this.m_contactManager.m_contactFilter = filter;
    };
    /// Register a contact event listener. The listener is owned by you and must
    /// remain in scope.
    b2World.prototype.SetContactListener = function (listener) {
        this.m_contactManager.m_contactListener = listener;
    };
    /// Register a routine for debug drawing. The debug draw functions are called
    /// inside with b2World::DebugDraw method. The debug draw object is owned
    /// by you and must remain in scope.
    b2World.prototype.SetDebugDraw = function (debugDraw) {
        this.m_debugDraw = debugDraw;
    };
    /// Create a rigid body given a definition. No reference to the definition
    /// is retained.
    /// @warning This function is locked during callbacks.
    b2World.prototype.CreateBody = function (def) {
        if (def === void 0) { def = {}; }
        if (this.IsLocked()) {
            throw new Error();
        }
        var b = new b2_body_js_1.b2Body(def, this);
        // Add to world doubly linked list.
        b.m_prev = null;
        b.m_next = this.m_bodyList;
        if (this.m_bodyList) {
            this.m_bodyList.m_prev = b;
        }
        this.m_bodyList = b;
        ++this.m_bodyCount;
        return b;
    };
    /// Destroy a rigid body given a definition. No reference to the definition
    /// is retained. This function is locked during callbacks.
    /// @warning This automatically deletes all associated shapes and joints.
    /// @warning This function is locked during callbacks.
    b2World.prototype.DestroyBody = function (b) {
        // DEBUG: b2Assert(this.m_bodyCount > 0);
        if (this.IsLocked()) {
            throw new Error();
        }
        // Delete the attached joints.
        var je = b.m_jointList;
        while (je) {
            var je0 = je;
            je = je.next;
            if (this.m_destructionListener) {
                this.m_destructionListener.SayGoodbyeJoint(je0.joint);
            }
            this.DestroyJoint(je0.joint);
            b.m_jointList = je;
        }
        b.m_jointList = null;
        // #if B2_ENABLE_CONTROLLER
        // @see b2Controller list
        var coe = b.m_controllerList;
        while (coe) {
            var coe0 = coe;
            coe = coe.nextController;
            coe0.controller.RemoveBody(b);
        }
        // #endif
        // Delete the attached contacts.
        var ce = b.m_contactList;
        while (ce) {
            var ce0 = ce;
            ce = ce.next;
            this.m_contactManager.Destroy(ce0.contact);
        }
        b.m_contactList = null;
        // Delete the attached fixtures. This destroys broad-phase proxies.
        var f = b.m_fixtureList;
        while (f) {
            var f0 = f;
            f = f.m_next;
            if (this.m_destructionListener) {
                this.m_destructionListener.SayGoodbyeFixture(f0);
            }
            f0.DestroyProxies();
            f0.Reset();
            b.m_fixtureList = f;
            b.m_fixtureCount -= 1;
        }
        b.m_fixtureList = null;
        b.m_fixtureCount = 0;
        // Remove world body list.
        if (b.m_prev) {
            b.m_prev.m_next = b.m_next;
        }
        if (b.m_next) {
            b.m_next.m_prev = b.m_prev;
        }
        if (b === this.m_bodyList) {
            this.m_bodyList = b.m_next;
        }
        --this.m_bodyCount;
    };
    b2World._Joint_Create = function (def) {
        switch (def.type) {
            case b2_joint_js_1.b2JointType.e_distanceJoint: return new b2_distance_joint_js_1.b2DistanceJoint(def);
            case b2_joint_js_1.b2JointType.e_mouseJoint: return new b2_mouse_joint_js_1.b2MouseJoint(def);
            case b2_joint_js_1.b2JointType.e_prismaticJoint: return new b2_prismatic_joint_js_1.b2PrismaticJoint(def);
            case b2_joint_js_1.b2JointType.e_revoluteJoint: return new b2_revolute_joint_js_1.b2RevoluteJoint(def);
            case b2_joint_js_1.b2JointType.e_pulleyJoint: return new b2_pulley_joint_js_1.b2PulleyJoint(def);
            case b2_joint_js_1.b2JointType.e_gearJoint: return new b2_gear_joint_js_1.b2GearJoint(def);
            case b2_joint_js_1.b2JointType.e_wheelJoint: return new b2_wheel_joint_js_1.b2WheelJoint(def);
            case b2_joint_js_1.b2JointType.e_weldJoint: return new b2_weld_joint_js_1.b2WeldJoint(def);
            case b2_joint_js_1.b2JointType.e_frictionJoint: return new b2_friction_joint_js_1.b2FrictionJoint(def);
            case b2_joint_js_1.b2JointType.e_motorJoint: return new b2_motor_joint_js_1.b2MotorJoint(def);
            case b2_joint_js_1.b2JointType.e_areaJoint: return new b2_area_joint_js_1.b2AreaJoint(def);
        }
        throw new Error();
    };
    b2World._Joint_Destroy = function (joint) {
    };
    b2World.prototype.CreateJoint = function (def) {
        if (this.IsLocked()) {
            throw new Error();
        }
        var j = b2World._Joint_Create(def);
        // Connect to the world list.
        j.m_prev = null;
        j.m_next = this.m_jointList;
        if (this.m_jointList) {
            this.m_jointList.m_prev = j;
        }
        this.m_jointList = j;
        ++this.m_jointCount;
        // Connect to the bodies' doubly linked lists.
        // j.m_edgeA.other = j.m_bodyB; // done in b2Joint constructor
        j.m_edgeA.prev = null;
        j.m_edgeA.next = j.m_bodyA.m_jointList;
        if (j.m_bodyA.m_jointList) {
            j.m_bodyA.m_jointList.prev = j.m_edgeA;
        }
        j.m_bodyA.m_jointList = j.m_edgeA;
        // j.m_edgeB.other = j.m_bodyA; // done in b2Joint constructor
        j.m_edgeB.prev = null;
        j.m_edgeB.next = j.m_bodyB.m_jointList;
        if (j.m_bodyB.m_jointList) {
            j.m_bodyB.m_jointList.prev = j.m_edgeB;
        }
        j.m_bodyB.m_jointList = j.m_edgeB;
        var bodyA = j.m_bodyA;
        var bodyB = j.m_bodyB;
        var collideConnected = j.m_collideConnected;
        // If the joint prevents collisions, then flag any contacts for filtering.
        if (!collideConnected) {
            var edge = bodyB.GetContactList();
            while (edge) {
                if (edge.other === bodyA) {
                    // Flag the contact for filtering at the next time step (where either
                    // body is awake).
                    edge.contact.FlagForFiltering();
                }
                edge = edge.next;
            }
        }
        // Note: creating a joint doesn't wake the bodies.
        return j;
    };
    /// Destroy a joint. This may cause the connected bodies to begin colliding.
    /// @warning This function is locked during callbacks.
    b2World.prototype.DestroyJoint = function (j) {
        if (this.IsLocked()) {
            throw new Error();
        }
        // Remove from the doubly linked list.
        if (j.m_prev) {
            j.m_prev.m_next = j.m_next;
        }
        if (j.m_next) {
            j.m_next.m_prev = j.m_prev;
        }
        if (j === this.m_jointList) {
            this.m_jointList = j.m_next;
        }
        // Disconnect from island graph.
        var bodyA = j.m_bodyA;
        var bodyB = j.m_bodyB;
        var collideConnected = j.m_collideConnected;
        // Wake up connected bodies.
        bodyA.SetAwake(true);
        bodyB.SetAwake(true);
        // Remove from body 1.
        if (j.m_edgeA.prev) {
            j.m_edgeA.prev.next = j.m_edgeA.next;
        }
        if (j.m_edgeA.next) {
            j.m_edgeA.next.prev = j.m_edgeA.prev;
        }
        if (j.m_edgeA === bodyA.m_jointList) {
            bodyA.m_jointList = j.m_edgeA.next;
        }
        j.m_edgeA.Reset();
        // Remove from body 2
        if (j.m_edgeB.prev) {
            j.m_edgeB.prev.next = j.m_edgeB.next;
        }
        if (j.m_edgeB.next) {
            j.m_edgeB.next.prev = j.m_edgeB.prev;
        }
        if (j.m_edgeB === bodyB.m_jointList) {
            bodyB.m_jointList = j.m_edgeB.next;
        }
        j.m_edgeB.Reset();
        b2World._Joint_Destroy(j);
        // DEBUG: b2Assert(this.m_jointCount > 0);
        --this.m_jointCount;
        // If the joint prevents collisions, then flag any contacts for filtering.
        if (!collideConnected) {
            var edge = bodyB.GetContactList();
            while (edge) {
                if (edge.other === bodyA) {
                    // Flag the contact for filtering at the next time step (where either
                    // body is awake).
                    edge.contact.FlagForFiltering();
                }
                edge = edge.next;
            }
        }
    };
    // #if B2_ENABLE_PARTICLE
    b2World.prototype.CreateParticleSystem = function (def) {
        if (this.IsLocked()) {
            throw new Error();
        }
        var p = new b2_particle_system_js_1.b2ParticleSystem(def, this);
        // Add to world doubly linked list.
        p.m_prev = null;
        p.m_next = this.m_particleSystemList;
        if (this.m_particleSystemList) {
            this.m_particleSystemList.m_prev = p;
        }
        this.m_particleSystemList = p;
        return p;
    };
    b2World.prototype.DestroyParticleSystem = function (p) {
        if (this.IsLocked()) {
            throw new Error();
        }
        // Remove world particleSystem list.
        if (p.m_prev) {
            p.m_prev.m_next = p.m_next;
        }
        if (p.m_next) {
            p.m_next.m_prev = p.m_prev;
        }
        if (p === this.m_particleSystemList) {
            this.m_particleSystemList = p.m_next;
        }
    };
    b2World.prototype.CalculateReasonableParticleIterations = function (timeStep) {
        if (this.m_particleSystemList === null) {
            return 1;
        }
        function GetSmallestRadius(world) {
            var smallestRadius = b2_settings_js_2.b2_maxFloat;
            for (var system = world.GetParticleSystemList(); system !== null; system = system.m_next) {
                smallestRadius = b2_math_js_1.b2Min(smallestRadius, system.GetRadius());
            }
            return smallestRadius;
        }
        // Use the smallest radius, since that represents the worst-case.
        return b2_particle_js_1.b2CalculateParticleIterations(this.m_gravity.Length(), GetSmallestRadius(this), timeStep);
    };
    // #if B2_ENABLE_PARTICLE
    b2World.prototype.Step = function (dt, velocityIterations, positionIterations, particleIterations) {
        if (particleIterations === void 0) { particleIterations = this.CalculateReasonableParticleIterations(dt); }
        // #else
        // public Step(dt: number, velocityIterations: number, positionIterations: number): void {
        // #endif
        var stepTimer = b2World.Step_s_stepTimer.Reset();
        // If new fixtures were added, we need to find the new contacts.
        if (this.m_newContacts) {
            this.m_contactManager.FindNewContacts();
            this.m_newContacts = false;
        }
        this.m_locked = true;
        var step = b2World.Step_s_step;
        step.dt = dt;
        step.velocityIterations = velocityIterations;
        step.positionIterations = positionIterations;
        // #if B2_ENABLE_PARTICLE
        step.particleIterations = particleIterations;
        // #endif
        if (dt > 0) {
            step.inv_dt = 1 / dt;
        }
        else {
            step.inv_dt = 0;
        }
        step.dtRatio = this.m_inv_dt0 * dt;
        step.warmStarting = this.m_warmStarting;
        // Update contacts. This is where some contacts are destroyed.
        var timer = b2World.Step_s_timer.Reset();
        this.m_contactManager.Collide();
        this.m_profile.collide = timer.GetMilliseconds();
        // Integrate velocities, solve velocity constraints, and integrate positions.
        if (this.m_stepComplete && step.dt > 0) {
            var timer_1 = b2World.Step_s_timer.Reset();
            // #if B2_ENABLE_PARTICLE
            for (var p = this.m_particleSystemList; p; p = p.m_next) {
                p.Solve(step); // Particle Simulation
            }
            // #endif
            this.Solve(step);
            this.m_profile.solve = timer_1.GetMilliseconds();
        }
        // Handle TOI events.
        if (this.m_continuousPhysics && step.dt > 0) {
            var timer_2 = b2World.Step_s_timer.Reset();
            this.SolveTOI(step);
            this.m_profile.solveTOI = timer_2.GetMilliseconds();
        }
        if (step.dt > 0) {
            this.m_inv_dt0 = step.inv_dt;
        }
        if (this.m_clearForces) {
            this.ClearForces();
        }
        this.m_locked = false;
        this.m_profile.step = stepTimer.GetMilliseconds();
    };
    /// Manually clear the force buffer on all bodies. By default, forces are cleared automatically
    /// after each call to Step. The default behavior is modified by calling SetAutoClearForces.
    /// The purpose of this function is to support sub-stepping. Sub-stepping is often used to maintain
    /// a fixed sized time step under a variable frame-rate.
    /// When you perform sub-stepping you will disable auto clearing of forces and instead call
    /// ClearForces after all sub-steps are complete in one pass of your game loop.
    /// @see SetAutoClearForces
    b2World.prototype.ClearForces = function () {
        for (var body = this.m_bodyList; body; body = body.m_next) {
            body.m_force.SetZero();
            body.m_torque = 0;
        }
    };
    // #if B2_ENABLE_PARTICLE
    b2World.prototype.DrawParticleSystem = function (system) {
        if (this.m_debugDraw === null) {
            return;
        }
        var particleCount = system.GetParticleCount();
        if (particleCount) {
            var radius = system.GetRadius();
            var positionBuffer = system.GetPositionBuffer();
            if (system.m_colorBuffer.data) {
                var colorBuffer = system.GetColorBuffer();
                this.m_debugDraw.DrawParticles(positionBuffer, radius, colorBuffer, particleCount);
            }
            else {
                this.m_debugDraw.DrawParticles(positionBuffer, radius, null, particleCount);
            }
        }
    };
    b2World.prototype.DebugDraw = function () {
        if (this.m_debugDraw === null) {
            return;
        }
        var flags = this.m_debugDraw.GetFlags();
        var color = b2World.DebugDraw_s_color.SetRGB(0, 0, 0);
        if (flags & b2_draw_js_1.b2DrawFlags.e_shapeBit) {
            for (var b = this.m_bodyList; b; b = b.m_next) {
                var xf = b.m_xf;
                this.m_debugDraw.PushTransform(xf);
                for (var f = b.GetFixtureList(); f; f = f.m_next) {
                    if (b.GetType() === b2_body_js_1.b2BodyType.b2_dynamicBody && b.m_mass === 0.0) {
                        // Bad body
                        this.DrawShape(f, new b2_draw_js_1.b2Color(1.0, 0.0, 0.0));
                    }
                    else if (!b.IsEnabled()) {
                        color.SetRGB(0.5, 0.5, 0.3);
                        this.DrawShape(f, color);
                    }
                    else if (b.GetType() === b2_body_js_1.b2BodyType.b2_staticBody) {
                        color.SetRGB(0.5, 0.9, 0.5);
                        this.DrawShape(f, color);
                    }
                    else if (b.GetType() === b2_body_js_1.b2BodyType.b2_kinematicBody) {
                        color.SetRGB(0.5, 0.5, 0.9);
                        this.DrawShape(f, color);
                    }
                    else if (!b.IsAwake()) {
                        color.SetRGB(0.6, 0.6, 0.6);
                        this.DrawShape(f, color);
                    }
                    else {
                        color.SetRGB(0.9, 0.7, 0.7);
                        this.DrawShape(f, color);
                    }
                }
                this.m_debugDraw.PopTransform(xf);
            }
        }
        // #if B2_ENABLE_PARTICLE
        if (flags & b2_draw_js_1.b2DrawFlags.e_particleBit) {
            for (var p = this.m_particleSystemList; p; p = p.m_next) {
                this.DrawParticleSystem(p);
            }
        }
        // #endif
        if (flags & b2_draw_js_1.b2DrawFlags.e_jointBit) {
            for (var j = this.m_jointList; j; j = j.m_next) {
                j.Draw(this.m_debugDraw);
            }
        }
        if (flags & b2_draw_js_1.b2DrawFlags.e_pairBit) {
            color.SetRGB(0.3, 0.9, 0.9);
            for (var contact = this.m_contactManager.m_contactList; contact; contact = contact.m_next) {
                var fixtureA = contact.GetFixtureA();
                var fixtureB = contact.GetFixtureB();
                var indexA = contact.GetChildIndexA();
                var indexB = contact.GetChildIndexB();
                var cA = fixtureA.GetAABB(indexA).GetCenter();
                var cB = fixtureB.GetAABB(indexB).GetCenter();
                this.m_debugDraw.DrawSegment(cA, cB, color);
            }
        }
        if (flags & b2_draw_js_1.b2DrawFlags.e_aabbBit) {
            color.SetRGB(0.9, 0.3, 0.9);
            var vs = b2World.DebugDraw_s_vs;
            for (var b = this.m_bodyList; b; b = b.m_next) {
                if (!b.IsEnabled()) {
                    continue;
                }
                for (var f = b.GetFixtureList(); f; f = f.m_next) {
                    for (var i = 0; i < f.m_proxyCount; ++i) {
                        var proxy = f.m_proxies[i];
                        var aabb = proxy.treeNode.aabb;
                        vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y);
                        vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y);
                        vs[2].Set(aabb.upperBound.x, aabb.upperBound.y);
                        vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y);
                        this.m_debugDraw.DrawPolygon(vs, 4, color);
                    }
                }
            }
        }
        if (flags & b2_draw_js_1.b2DrawFlags.e_centerOfMassBit) {
            for (var b = this.m_bodyList; b; b = b.m_next) {
                var xf = b2World.DebugDraw_s_xf;
                xf.q.Copy(b.m_xf.q);
                xf.p.Copy(b.GetWorldCenter());
                this.m_debugDraw.DrawTransform(xf);
            }
        }
        // #if B2_ENABLE_CONTROLLER
        // @see b2Controller list
        if (flags & b2_draw_js_1.b2DrawFlags.e_controllerBit) {
            for (var c = this.m_controllerList; c; c = c.m_next) {
                c.Draw(this.m_debugDraw);
            }
        }
        // #endif
    };
    b2World.prototype.QueryAABB = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] instanceof b2_world_callbacks_js_1.b2QueryCallback) {
            this._QueryAABB(args[0], args[1]);
        }
        else {
            this._QueryAABB(null, args[0], args[1]);
        }
    };
    b2World.prototype._QueryAABB = function (callback, aabb, fn) {
        this.m_contactManager.m_broadPhase.Query(aabb, function (proxy) {
            var fixture_proxy = proxy.userData;
            // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
            var fixture = fixture_proxy.fixture;
            if (callback) {
                return callback.ReportFixture(fixture);
            }
            else if (fn) {
                return fn(fixture);
            }
            return true;
        });
        // #if B2_ENABLE_PARTICLE
        if (callback instanceof b2_world_callbacks_js_1.b2QueryCallback) {
            for (var p = this.m_particleSystemList; p; p = p.m_next) {
                if (callback.ShouldQueryParticleSystem(p)) {
                    p.QueryAABB(callback, aabb);
                }
            }
        }
        // #endif
    };
    b2World.prototype.QueryAllAABB = function (aabb, out) {
        if (out === void 0) { out = []; }
        this.QueryAABB(aabb, function (fixture) { out.push(fixture); return true; });
        return out;
    };
    b2World.prototype.QueryPointAABB = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] instanceof b2_world_callbacks_js_1.b2QueryCallback) {
            this._QueryPointAABB(args[0], args[1]);
        }
        else {
            this._QueryPointAABB(null, args[0], args[1]);
        }
    };
    b2World.prototype._QueryPointAABB = function (callback, point, fn) {
        this.m_contactManager.m_broadPhase.QueryPoint(point, function (proxy) {
            var fixture_proxy = proxy.userData;
            // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
            var fixture = fixture_proxy.fixture;
            if (callback) {
                return callback.ReportFixture(fixture);
            }
            else if (fn) {
                return fn(fixture);
            }
            return true;
        });
        // #if B2_ENABLE_PARTICLE
        if (callback instanceof b2_world_callbacks_js_1.b2QueryCallback) {
            for (var p = this.m_particleSystemList; p; p = p.m_next) {
                if (callback.ShouldQueryParticleSystem(p)) {
                    p.QueryPointAABB(callback, point);
                }
            }
        }
        // #endif
    };
    b2World.prototype.QueryAllPointAABB = function (point, out) {
        if (out === void 0) { out = []; }
        this.QueryPointAABB(point, function (fixture) { out.push(fixture); return true; });
        return out;
    };
    b2World.prototype.QueryFixtureShape = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] instanceof b2_world_callbacks_js_1.b2QueryCallback) {
            this._QueryFixtureShape(args[0], args[1], args[2], args[3]);
        }
        else {
            this._QueryFixtureShape(null, args[0], args[1], args[2], args[3]);
        }
    };
    b2World.prototype._QueryFixtureShape = function (callback, shape, index, transform, fn) {
        var aabb = b2World.QueryFixtureShape_s_aabb;
        shape.ComputeAABB(aabb, transform, index);
        this.m_contactManager.m_broadPhase.Query(aabb, function (proxy) {
            var fixture_proxy = proxy.userData;
            // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
            var fixture = fixture_proxy.fixture;
            if (b2_collision_js_1.b2TestOverlapShape(shape, index, fixture.GetShape(), fixture_proxy.childIndex, transform, fixture.GetBody().GetTransform())) {
                if (callback) {
                    return callback.ReportFixture(fixture);
                }
                else if (fn) {
                    return fn(fixture);
                }
            }
            return true;
        });
        // #if B2_ENABLE_PARTICLE
        if (callback instanceof b2_world_callbacks_js_1.b2QueryCallback) {
            for (var p = this.m_particleSystemList; p; p = p.m_next) {
                if (callback.ShouldQueryParticleSystem(p)) {
                    p.QueryAABB(callback, aabb);
                }
            }
        }
        // #endif
    };
    b2World.prototype.QueryAllFixtureShape = function (shape, index, transform, out) {
        if (out === void 0) { out = []; }
        this.QueryFixtureShape(shape, index, transform, function (fixture) { out.push(fixture); return true; });
        return out;
    };
    b2World.prototype.QueryFixturePoint = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] instanceof b2_world_callbacks_js_1.b2QueryCallback) {
            this._QueryFixturePoint(args[0], args[1]);
        }
        else {
            this._QueryFixturePoint(null, args[0], args[1]);
        }
    };
    b2World.prototype._QueryFixturePoint = function (callback, point, fn) {
        this.m_contactManager.m_broadPhase.QueryPoint(point, function (proxy) {
            var fixture_proxy = proxy.userData;
            // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
            var fixture = fixture_proxy.fixture;
            if (fixture.TestPoint(point)) {
                if (callback) {
                    return callback.ReportFixture(fixture);
                }
                else if (fn) {
                    return fn(fixture);
                }
            }
            return true;
        });
        // #if B2_ENABLE_PARTICLE
        if (callback) {
            for (var p = this.m_particleSystemList; p; p = p.m_next) {
                if (callback.ShouldQueryParticleSystem(p)) {
                    p.QueryPointAABB(callback, point);
                }
            }
        }
        // #endif
    };
    b2World.prototype.QueryAllFixturePoint = function (point, out) {
        if (out === void 0) { out = []; }
        this.QueryFixturePoint(point, function (fixture) { out.push(fixture); return true; });
        return out;
    };
    b2World.prototype.RayCast = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] instanceof b2_world_callbacks_js_2.b2RayCastCallback) {
            this._RayCast(args[0], args[1], args[2]);
        }
        else {
            this._RayCast(null, args[0], args[1], args[2]);
        }
    };
    b2World.prototype._RayCast = function (callback, point1, point2, fn) {
        var input = b2World.RayCast_s_input;
        input.maxFraction = 1;
        input.p1.Copy(point1);
        input.p2.Copy(point2);
        this.m_contactManager.m_broadPhase.RayCast(input, function (input, proxy) {
            var fixture_proxy = proxy.userData;
            // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
            var fixture = fixture_proxy.fixture;
            var index = fixture_proxy.childIndex;
            var output = b2World.RayCast_s_output;
            var hit = fixture.RayCast(output, input, index);
            if (hit) {
                var fraction = output.fraction;
                var point = b2World.RayCast_s_point;
                point.Set((1 - fraction) * point1.x + fraction * point2.x, (1 - fraction) * point1.y + fraction * point2.y);
                if (callback) {
                    return callback.ReportFixture(fixture, point, output.normal, fraction);
                }
                else if (fn) {
                    return fn(fixture, point, output.normal, fraction);
                }
            }
            return input.maxFraction;
        });
        // #if B2_ENABLE_PARTICLE
        if (callback) {
            for (var p = this.m_particleSystemList; p; p = p.m_next) {
                if (callback.ShouldQueryParticleSystem(p)) {
                    p.RayCast(callback, point1, point2);
                }
            }
        }
        // #endif
    };
    b2World.prototype.RayCastOne = function (point1, point2) {
        var result = null;
        var min_fraction = 1;
        this.RayCast(point1, point2, function (fixture, point, normal, fraction) {
            if (fraction < min_fraction) {
                min_fraction = fraction;
                result = fixture;
            }
            return min_fraction;
        });
        return result;
    };
    b2World.prototype.RayCastAll = function (point1, point2, out) {
        if (out === void 0) { out = []; }
        this.RayCast(point1, point2, function (fixture, point, normal, fraction) {
            out.push(fixture);
            return 1;
        });
        return out;
    };
    /// Get the world body list. With the returned body, use b2Body::GetNext to get
    /// the next body in the world list. A NULL body indicates the end of the list.
    /// @return the head of the world body list.
    b2World.prototype.GetBodyList = function () {
        return this.m_bodyList;
    };
    /// Get the world joint list. With the returned joint, use b2Joint::GetNext to get
    /// the next joint in the world list. A NULL joint indicates the end of the list.
    /// @return the head of the world joint list.
    b2World.prototype.GetJointList = function () {
        return this.m_jointList;
    };
    // #if B2_ENABLE_PARTICLE
    b2World.prototype.GetParticleSystemList = function () {
        return this.m_particleSystemList;
    };
    // #endif
    /// Get the world contact list. With the returned contact, use b2Contact::GetNext to get
    /// the next contact in the world list. A NULL contact indicates the end of the list.
    /// @return the head of the world contact list.
    /// @warning contacts are created and destroyed in the middle of a time step.
    /// Use b2ContactListener to avoid missing contacts.
    b2World.prototype.GetContactList = function () {
        return this.m_contactManager.m_contactList;
    };
    /// Enable/disable sleep.
    b2World.prototype.SetAllowSleeping = function (flag) {
        if (flag === this.m_allowSleep) {
            return;
        }
        this.m_allowSleep = flag;
        if (!this.m_allowSleep) {
            for (var b = this.m_bodyList; b; b = b.m_next) {
                b.SetAwake(true);
            }
        }
    };
    b2World.prototype.GetAllowSleeping = function () {
        return this.m_allowSleep;
    };
    /// Enable/disable warm starting. For testing.
    b2World.prototype.SetWarmStarting = function (flag) {
        this.m_warmStarting = flag;
    };
    b2World.prototype.GetWarmStarting = function () {
        return this.m_warmStarting;
    };
    /// Enable/disable continuous physics. For testing.
    b2World.prototype.SetContinuousPhysics = function (flag) {
        this.m_continuousPhysics = flag;
    };
    b2World.prototype.GetContinuousPhysics = function () {
        return this.m_continuousPhysics;
    };
    /// Enable/disable single stepped continuous physics. For testing.
    b2World.prototype.SetSubStepping = function (flag) {
        this.m_subStepping = flag;
    };
    b2World.prototype.GetSubStepping = function () {
        return this.m_subStepping;
    };
    /// Get the number of broad-phase proxies.
    b2World.prototype.GetProxyCount = function () {
        return this.m_contactManager.m_broadPhase.GetProxyCount();
    };
    /// Get the number of bodies.
    b2World.prototype.GetBodyCount = function () {
        return this.m_bodyCount;
    };
    /// Get the number of joints.
    b2World.prototype.GetJointCount = function () {
        return this.m_jointCount;
    };
    /// Get the number of contacts (each may have 0 or more contact points).
    b2World.prototype.GetContactCount = function () {
        return this.m_contactManager.m_contactCount;
    };
    /// Get the height of the dynamic tree.
    b2World.prototype.GetTreeHeight = function () {
        return this.m_contactManager.m_broadPhase.GetTreeHeight();
    };
    /// Get the balance of the dynamic tree.
    b2World.prototype.GetTreeBalance = function () {
        return this.m_contactManager.m_broadPhase.GetTreeBalance();
    };
    /// Get the quality metric of the dynamic tree. The smaller the better.
    /// The minimum is 1.
    b2World.prototype.GetTreeQuality = function () {
        return this.m_contactManager.m_broadPhase.GetTreeQuality();
    };
    /// Change the global gravity vector.
    b2World.prototype.SetGravity = function (gravity, wake) {
        if (wake === void 0) { wake = true; }
        if (!b2_math_js_1.b2Vec2.IsEqualToV(this.m_gravity, gravity)) {
            this.m_gravity.Copy(gravity);
            if (wake) {
                for (var b = this.m_bodyList; b; b = b.m_next) {
                    b.SetAwake(true);
                }
            }
        }
    };
    /// Get the global gravity vector.
    b2World.prototype.GetGravity = function () {
        return this.m_gravity;
    };
    /// Is the world locked (in the middle of a time step).
    b2World.prototype.IsLocked = function () {
        return this.m_locked;
    };
    /// Set flag to control automatic clearing of forces after each time step.
    b2World.prototype.SetAutoClearForces = function (flag) {
        this.m_clearForces = flag;
    };
    /// Get the flag that controls automatic clearing of forces after each time step.
    b2World.prototype.GetAutoClearForces = function () {
        return this.m_clearForces;
    };
    /// Shift the world origin. Useful for large worlds.
    /// The body shift formula is: position -= newOrigin
    /// @param newOrigin the new origin with respect to the old origin
    b2World.prototype.ShiftOrigin = function (newOrigin) {
        if (this.IsLocked()) {
            throw new Error();
        }
        for (var b = this.m_bodyList; b; b = b.m_next) {
            b.m_xf.p.SelfSub(newOrigin);
            b.m_sweep.c0.SelfSub(newOrigin);
            b.m_sweep.c.SelfSub(newOrigin);
        }
        for (var j = this.m_jointList; j; j = j.m_next) {
            j.ShiftOrigin(newOrigin);
        }
        this.m_contactManager.m_broadPhase.ShiftOrigin(newOrigin);
    };
    /// Get the contact manager for testing.
    b2World.prototype.GetContactManager = function () {
        return this.m_contactManager;
    };
    /// Get the current profile.
    b2World.prototype.GetProfile = function () {
        return this.m_profile;
    };
    /// Dump the world into the log file.
    /// @warning this should be called outside of a time step.
    b2World.prototype.Dump = function (log) {
        if (this.m_locked) {
            return;
        }
        // b2OpenDump("box2d_dump.inl");
        log("const g: b2Vec2 = new b2Vec2(%.15f, %.15f);\n", this.m_gravity.x, this.m_gravity.y);
        log("this.m_world.SetGravity(g);\n");
        log("const bodies: b2Body[] = [];\n");
        log("const joints: b2Joint[] = [];\n");
        var i = 0;
        for (var b = this.m_bodyList; b; b = b.m_next) {
            b.m_islandIndex = i;
            b.Dump(log);
            ++i;
        }
        i = 0;
        for (var j = this.m_jointList; j; j = j.m_next) {
            j.m_index = i;
            ++i;
        }
        // First pass on joints, skip gear joints.
        for (var j = this.m_jointList; j; j = j.m_next) {
            if (j.m_type === b2_joint_js_1.b2JointType.e_gearJoint) {
                continue;
            }
            log("{\n");
            j.Dump(log);
            log("}\n");
        }
        // Second pass on joints, only gear joints.
        for (var j = this.m_jointList; j; j = j.m_next) {
            if (j.m_type !== b2_joint_js_1.b2JointType.e_gearJoint) {
                continue;
            }
            log("{\n");
            j.Dump(log);
            log("}\n");
        }
        // b2CloseDump();
    };
    b2World.prototype.DrawShape = function (fixture, color) {
        if (this.m_debugDraw === null) {
            return;
        }
        var shape = fixture.GetShape();
        switch (shape.m_type) {
            case b2_shape_js_1.b2ShapeType.e_circleShape: {
                var circle = shape;
                var center = circle.m_p;
                var radius = circle.m_radius;
                var axis = b2_math_js_1.b2Vec2.UNITX;
                this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
                break;
            }
            case b2_shape_js_1.b2ShapeType.e_edgeShape: {
                var edge = shape;
                var v1 = edge.m_vertex1;
                var v2 = edge.m_vertex2;
                this.m_debugDraw.DrawSegment(v1, v2, color);
                if (edge.m_oneSided === false) {
                    this.m_debugDraw.DrawPoint(v1, 4.0, color);
                    this.m_debugDraw.DrawPoint(v2, 4.0, color);
                }
                break;
            }
            case b2_shape_js_1.b2ShapeType.e_chainShape: {
                var chain = shape;
                var count = chain.m_count;
                var vertices = chain.m_vertices;
                var v1 = vertices[0];
                for (var i = 1; i < count; ++i) {
                    var v2 = vertices[i];
                    this.m_debugDraw.DrawSegment(v1, v2, color);
                    v1 = v2;
                }
                break;
            }
            case b2_shape_js_1.b2ShapeType.e_polygonShape: {
                var poly = shape;
                var vertexCount = poly.m_count;
                var vertices = poly.m_vertices;
                this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
                break;
            }
        }
    };
    b2World.prototype.Solve = function (step) {
        // #if B2_ENABLE_PARTICLE
        // update previous transforms
        for (var b = this.m_bodyList; b; b = b.m_next) {
            b.m_xf0.Copy(b.m_xf);
        }
        // #endif
        // #if B2_ENABLE_CONTROLLER
        // @see b2Controller list
        for (var controller = this.m_controllerList; controller; controller = controller.m_next) {
            controller.Step(step);
        }
        // #endif
        this.m_profile.solveInit = 0;
        this.m_profile.solveVelocity = 0;
        this.m_profile.solvePosition = 0;
        // Size the island for the worst case.
        var island = this.m_island;
        island.Initialize(this.m_bodyCount, this.m_contactManager.m_contactCount, this.m_jointCount, this.m_contactManager.m_contactListener);
        // Clear all the island flags.
        for (var b = this.m_bodyList; b; b = b.m_next) {
            b.m_islandFlag = false;
        }
        for (var c = this.m_contactManager.m_contactList; c; c = c.m_next) {
            c.m_islandFlag = false;
        }
        for (var j = this.m_jointList; j; j = j.m_next) {
            j.m_islandFlag = false;
        }
        // Build and simulate all awake islands.
        // DEBUG: const stackSize: number = this.m_bodyCount;
        var stack = this.s_stack;
        for (var seed = this.m_bodyList; seed; seed = seed.m_next) {
            if (seed.m_islandFlag) {
                continue;
            }
            if (!seed.IsAwake() || !seed.IsEnabled()) {
                continue;
            }
            // The seed can be dynamic or kinematic.
            if (seed.GetType() === b2_body_js_1.b2BodyType.b2_staticBody) {
                continue;
            }
            // Reset island and stack.
            island.Clear();
            var stackCount = 0;
            stack[stackCount++] = seed;
            seed.m_islandFlag = true;
            // Perform a depth first search (DFS) on the constraint graph.
            while (stackCount > 0) {
                // Grab the next body off the stack and add it to the island.
                var b = stack[--stackCount];
                if (!b) {
                    throw new Error();
                }
                // DEBUG: b2Assert(b.IsEnabled());
                island.AddBody(b);
                // To keep islands as small as possible, we don't
                // propagate islands across static bodies.
                if (b.GetType() === b2_body_js_1.b2BodyType.b2_staticBody) {
                    continue;
                }
                // Make sure the body is awake. (without resetting sleep timer).
                b.m_awakeFlag = true;
                // Search all contacts connected to this body.
                for (var ce = b.m_contactList; ce; ce = ce.next) {
                    var contact = ce.contact;
                    // Has this contact already been added to an island?
                    if (contact.m_islandFlag) {
                        continue;
                    }
                    // Is this contact solid and touching?
                    if (!contact.IsEnabled() || !contact.IsTouching()) {
                        continue;
                    }
                    // Skip sensors.
                    var sensorA = contact.m_fixtureA.m_isSensor;
                    var sensorB = contact.m_fixtureB.m_isSensor;
                    if (sensorA || sensorB) {
                        continue;
                    }
                    island.AddContact(contact);
                    contact.m_islandFlag = true;
                    var other = ce.other;
                    // Was the other body already added to this island?
                    if (other.m_islandFlag) {
                        continue;
                    }
                    // DEBUG: b2Assert(stackCount < stackSize);
                    stack[stackCount++] = other;
                    other.m_islandFlag = true;
                }
                // Search all joints connect to this body.
                for (var je = b.m_jointList; je; je = je.next) {
                    if (je.joint.m_islandFlag) {
                        continue;
                    }
                    var other = je.other;
                    // Don't simulate joints connected to disabled bodies.
                    if (!other.IsEnabled()) {
                        continue;
                    }
                    island.AddJoint(je.joint);
                    je.joint.m_islandFlag = true;
                    if (other.m_islandFlag) {
                        continue;
                    }
                    // DEBUG: b2Assert(stackCount < stackSize);
                    stack[stackCount++] = other;
                    other.m_islandFlag = true;
                }
            }
            var profile = new b2_time_step_js_1.b2Profile();
            island.Solve(profile, step, this.m_gravity, this.m_allowSleep);
            this.m_profile.solveInit += profile.solveInit;
            this.m_profile.solveVelocity += profile.solveVelocity;
            this.m_profile.solvePosition += profile.solvePosition;
            // Post solve cleanup.
            for (var i = 0; i < island.m_bodyCount; ++i) {
                // Allow static bodies to participate in other islands.
                var b = island.m_bodies[i];
                if (b.GetType() === b2_body_js_1.b2BodyType.b2_staticBody) {
                    b.m_islandFlag = false;
                }
            }
        }
        for (var i = 0; i < stack.length; ++i) {
            if (!stack[i]) {
                break;
            }
            stack[i] = null;
        }
        var timer = new b2_timer_js_1.b2Timer();
        // Synchronize fixtures, check for out of range bodies.
        for (var b = this.m_bodyList; b; b = b.m_next) {
            // If a body was not in an island then it did not move.
            if (!b.m_islandFlag) {
                continue;
            }
            if (b.GetType() === b2_body_js_1.b2BodyType.b2_staticBody) {
                continue;
            }
            // Update fixtures (for broad-phase).
            b.SynchronizeFixtures();
        }
        // Look for new contacts.
        this.m_contactManager.FindNewContacts();
        this.m_profile.broadphase = timer.GetMilliseconds();
    };
    b2World.prototype.SolveTOI = function (step) {
        var island = this.m_island;
        island.Initialize(2 * b2_settings_js_1.b2_maxTOIContacts, b2_settings_js_1.b2_maxTOIContacts, 0, this.m_contactManager.m_contactListener);
        if (this.m_stepComplete) {
            for (var b = this.m_bodyList; b; b = b.m_next) {
                b.m_islandFlag = false;
                b.m_sweep.alpha0 = 0;
            }
            for (var c = this.m_contactManager.m_contactList; c; c = c.m_next) {
                // Invalidate TOI
                c.m_toiFlag = false;
                c.m_islandFlag = false;
                c.m_toiCount = 0;
                c.m_toi = 1;
            }
        }
        // Find TOI events and solve them.
        for (;;) {
            // Find the first TOI.
            var minContact = null;
            var minAlpha = 1;
            for (var c = this.m_contactManager.m_contactList; c; c = c.m_next) {
                // Is this contact disabled?
                if (!c.IsEnabled()) {
                    continue;
                }
                // Prevent excessive sub-stepping.
                if (c.m_toiCount > b2_settings_js_1.b2_maxSubSteps) {
                    continue;
                }
                var alpha = 1;
                if (c.m_toiFlag) {
                    // This contact has a valid cached TOI.
                    alpha = c.m_toi;
                }
                else {
                    var fA_1 = c.GetFixtureA();
                    var fB_1 = c.GetFixtureB();
                    // Is there a sensor?
                    if (fA_1.IsSensor() || fB_1.IsSensor()) {
                        continue;
                    }
                    var bA_1 = fA_1.GetBody();
                    var bB_1 = fB_1.GetBody();
                    var typeA = bA_1.m_type;
                    var typeB = bB_1.m_type;
                    // DEBUG: b2Assert(typeA !== b2BodyType.b2_staticBody || typeB !== b2BodyType.b2_staticBody);
                    var activeA = bA_1.IsAwake() && typeA !== b2_body_js_1.b2BodyType.b2_staticBody;
                    var activeB = bB_1.IsAwake() && typeB !== b2_body_js_1.b2BodyType.b2_staticBody;
                    // Is at least one body active (awake and dynamic or kinematic)?
                    if (!activeA && !activeB) {
                        continue;
                    }
                    var collideA = bA_1.IsBullet() || typeA !== b2_body_js_1.b2BodyType.b2_dynamicBody;
                    var collideB = bB_1.IsBullet() || typeB !== b2_body_js_1.b2BodyType.b2_dynamicBody;
                    // Are these two non-bullet dynamic bodies?
                    if (!collideA && !collideB) {
                        continue;
                    }
                    // Compute the TOI for this contact.
                    // Put the sweeps onto the same time interval.
                    var alpha0 = bA_1.m_sweep.alpha0;
                    if (bA_1.m_sweep.alpha0 < bB_1.m_sweep.alpha0) {
                        alpha0 = bB_1.m_sweep.alpha0;
                        bA_1.m_sweep.Advance(alpha0);
                    }
                    else if (bB_1.m_sweep.alpha0 < bA_1.m_sweep.alpha0) {
                        alpha0 = bA_1.m_sweep.alpha0;
                        bB_1.m_sweep.Advance(alpha0);
                    }
                    // DEBUG: b2Assert(alpha0 < 1);
                    var indexA = c.GetChildIndexA();
                    var indexB = c.GetChildIndexB();
                    // Compute the time of impact in interval [0, minTOI]
                    var input = b2World.SolveTOI_s_toi_input;
                    input.proxyA.SetShape(fA_1.GetShape(), indexA);
                    input.proxyB.SetShape(fB_1.GetShape(), indexB);
                    input.sweepA.Copy(bA_1.m_sweep);
                    input.sweepB.Copy(bB_1.m_sweep);
                    input.tMax = 1;
                    var output = b2World.SolveTOI_s_toi_output;
                    b2_time_of_impact_js_1.b2TimeOfImpact(output, input);
                    // Beta is the fraction of the remaining portion of the .
                    var beta = output.t;
                    if (output.state === b2_time_of_impact_js_1.b2TOIOutputState.e_touching) {
                        alpha = b2_math_js_1.b2Min(alpha0 + (1 - alpha0) * beta, 1);
                    }
                    else {
                        alpha = 1;
                    }
                    c.m_toi = alpha;
                    c.m_toiFlag = true;
                }
                if (alpha < minAlpha) {
                    // This is the minimum TOI found so far.
                    minContact = c;
                    minAlpha = alpha;
                }
            }
            if (minContact === null || 1 - 10 * b2_settings_js_1.b2_epsilon < minAlpha) {
                // No more TOI events. Done!
                this.m_stepComplete = true;
                break;
            }
            // Advance the bodies to the TOI.
            var fA = minContact.GetFixtureA();
            var fB = minContact.GetFixtureB();
            var bA = fA.GetBody();
            var bB = fB.GetBody();
            var backup1 = b2World.SolveTOI_s_backup1.Copy(bA.m_sweep);
            var backup2 = b2World.SolveTOI_s_backup2.Copy(bB.m_sweep);
            bA.Advance(minAlpha);
            bB.Advance(minAlpha);
            // The TOI contact likely has some new contact points.
            minContact.Update(this.m_contactManager.m_contactListener);
            minContact.m_toiFlag = false;
            ++minContact.m_toiCount;
            // Is the contact solid?
            if (!minContact.IsEnabled() || !minContact.IsTouching()) {
                // Restore the sweeps.
                minContact.SetEnabled(false);
                bA.m_sweep.Copy(backup1);
                bB.m_sweep.Copy(backup2);
                bA.SynchronizeTransform();
                bB.SynchronizeTransform();
                continue;
            }
            bA.SetAwake(true);
            bB.SetAwake(true);
            // Build the island
            island.Clear();
            island.AddBody(bA);
            island.AddBody(bB);
            island.AddContact(minContact);
            bA.m_islandFlag = true;
            bB.m_islandFlag = true;
            minContact.m_islandFlag = true;
            // Get contacts on bodyA and bodyB.
            // const bodies: b2Body[] = [bA, bB];
            for (var i = 0; i < 2; ++i) {
                var body = (i === 0) ? (bA) : (bB); // bodies[i];
                if (body.m_type === b2_body_js_1.b2BodyType.b2_dynamicBody) {
                    for (var ce = body.m_contactList; ce; ce = ce.next) {
                        if (island.m_bodyCount === island.m_bodyCapacity) {
                            break;
                        }
                        if (island.m_contactCount === island.m_contactCapacity) {
                            break;
                        }
                        var contact = ce.contact;
                        // Has this contact already been added to the island?
                        if (contact.m_islandFlag) {
                            continue;
                        }
                        // Only add static, kinematic, or bullet bodies.
                        var other = ce.other;
                        if (other.m_type === b2_body_js_1.b2BodyType.b2_dynamicBody &&
                            !body.IsBullet() && !other.IsBullet()) {
                            continue;
                        }
                        // Skip sensors.
                        var sensorA = contact.m_fixtureA.m_isSensor;
                        var sensorB = contact.m_fixtureB.m_isSensor;
                        if (sensorA || sensorB) {
                            continue;
                        }
                        // Tentatively advance the body to the TOI.
                        var backup = b2World.SolveTOI_s_backup.Copy(other.m_sweep);
                        if (!other.m_islandFlag) {
                            other.Advance(minAlpha);
                        }
                        // Update the contact points
                        contact.Update(this.m_contactManager.m_contactListener);
                        // Was the contact disabled by the user?
                        if (!contact.IsEnabled()) {
                            other.m_sweep.Copy(backup);
                            other.SynchronizeTransform();
                            continue;
                        }
                        // Are there contact points?
                        if (!contact.IsTouching()) {
                            other.m_sweep.Copy(backup);
                            other.SynchronizeTransform();
                            continue;
                        }
                        // Add the contact to the island
                        contact.m_islandFlag = true;
                        island.AddContact(contact);
                        // Has the other body already been added to the island?
                        if (other.m_islandFlag) {
                            continue;
                        }
                        // Add the other body to the island.
                        other.m_islandFlag = true;
                        if (other.m_type !== b2_body_js_1.b2BodyType.b2_staticBody) {
                            other.SetAwake(true);
                        }
                        island.AddBody(other);
                    }
                }
            }
            var subStep = b2World.SolveTOI_s_subStep;
            subStep.dt = (1 - minAlpha) * step.dt;
            subStep.inv_dt = 1 / subStep.dt;
            subStep.dtRatio = 1;
            subStep.positionIterations = 20;
            subStep.velocityIterations = step.velocityIterations;
            // #if B2_ENABLE_PARTICLE
            subStep.particleIterations = step.particleIterations;
            // #endif
            subStep.warmStarting = false;
            island.SolveTOI(subStep, bA.m_islandIndex, bB.m_islandIndex);
            // Reset island flags and synchronize broad-phase proxies.
            for (var i = 0; i < island.m_bodyCount; ++i) {
                var body = island.m_bodies[i];
                body.m_islandFlag = false;
                if (body.m_type !== b2_body_js_1.b2BodyType.b2_dynamicBody) {
                    continue;
                }
                body.SynchronizeFixtures();
                // Invalidate all contact TOIs on this displaced body.
                for (var ce = body.m_contactList; ce; ce = ce.next) {
                    ce.contact.m_toiFlag = false;
                    ce.contact.m_islandFlag = false;
                }
            }
            // Commit fixture proxy movements to the broad-phase so that new contacts are created.
            // Also, some contacts can be destroyed.
            this.m_contactManager.FindNewContacts();
            if (this.m_subStepping) {
                this.m_stepComplete = false;
                break;
            }
        }
    };
    // #if B2_ENABLE_CONTROLLER
    b2World.prototype.AddController = function (controller) {
        // b2Assert(controller.m_world === null, "Controller can only be a member of one world");
        // controller.m_world = this;
        controller.m_next = this.m_controllerList;
        controller.m_prev = null;
        if (this.m_controllerList) {
            this.m_controllerList.m_prev = controller;
        }
        this.m_controllerList = controller;
        ++this.m_controllerCount;
        return controller;
    };
    b2World.prototype.RemoveController = function (controller) {
        // b2Assert(controller.m_world === this, "Controller is not a member of this world");
        if (controller.m_prev) {
            controller.m_prev.m_next = controller.m_next;
        }
        if (controller.m_next) {
            controller.m_next.m_prev = controller.m_prev;
        }
        if (this.m_controllerList === controller) {
            this.m_controllerList = controller.m_next;
        }
        --this.m_controllerCount;
        controller.m_prev = null;
        controller.m_next = null;
        // delete controller.m_world; // = null;
        return controller;
    };
    // #endif
    /// Take a time step. This performs collision detection, integration,
    /// and constraint solution.
    /// @param timeStep the amount of time to simulate, this should not vary.
    /// @param velocityIterations for the velocity constraint solver.
    /// @param positionIterations for the position constraint solver.
    b2World.Step_s_step = new b2_time_step_js_1.b2TimeStep();
    b2World.Step_s_stepTimer = new b2_timer_js_1.b2Timer();
    b2World.Step_s_timer = new b2_timer_js_1.b2Timer();
    // #endif
    /// Call this to draw shapes and other debug draw data.
    b2World.DebugDraw_s_color = new b2_draw_js_1.b2Color(0, 0, 0);
    b2World.DebugDraw_s_vs = b2_math_js_1.b2Vec2.MakeArray(4);
    b2World.DebugDraw_s_xf = new b2_math_js_1.b2Transform();
    b2World.QueryFixtureShape_s_aabb = new b2_collision_js_1.b2AABB();
    b2World.RayCast_s_input = new b2_collision_js_1.b2RayCastInput();
    b2World.RayCast_s_output = new b2_collision_js_1.b2RayCastOutput();
    b2World.RayCast_s_point = new b2_math_js_1.b2Vec2();
    b2World.SolveTOI_s_subStep = new b2_time_step_js_1.b2TimeStep();
    b2World.SolveTOI_s_backup = new b2_math_js_1.b2Sweep();
    b2World.SolveTOI_s_backup1 = new b2_math_js_1.b2Sweep();
    b2World.SolveTOI_s_backup2 = new b2_math_js_1.b2Sweep();
    b2World.SolveTOI_s_toi_input = new b2_time_of_impact_js_1.b2TOIInput();
    b2World.SolveTOI_s_toi_output = new b2_time_of_impact_js_1.b2TOIOutput();
    return b2World;
}());
exports.b2World = b2World;
