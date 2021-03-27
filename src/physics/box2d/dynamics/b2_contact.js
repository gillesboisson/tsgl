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
exports.b2Contact = exports.b2ContactEdge = exports.b2MixRestitutionThreshold = exports.b2MixRestitution = exports.b2MixFriction = void 0;
var b2_settings_js_1 = require("../common/b2_settings.js");
var b2_math_js_1 = require("../common/b2_math.js");
var b2_collision_js_1 = require("../collision/b2_collision.js");
var b2_collision_js_2 = require("../collision/b2_collision.js");
var b2_time_of_impact_js_1 = require("../collision/b2_time_of_impact.js");
/// Friction mixing law. The idea is to allow either fixture to drive the friction to zero.
/// For example, anything slides on ice.
function b2MixFriction(friction1, friction2) {
    return b2_math_js_1.b2Sqrt(friction1 * friction2);
}
exports.b2MixFriction = b2MixFriction;
/// Restitution mixing law. The idea is allow for anything to bounce off an inelastic surface.
/// For example, a superball bounces on anything.
function b2MixRestitution(restitution1, restitution2) {
    return restitution1 > restitution2 ? restitution1 : restitution2;
}
exports.b2MixRestitution = b2MixRestitution;
/// Restitution mixing law. This picks the lowest value.
function b2MixRestitutionThreshold(threshold1, threshold2) {
    return threshold1 < threshold2 ? threshold1 : threshold2;
}
exports.b2MixRestitutionThreshold = b2MixRestitutionThreshold;
var b2ContactEdge = /** @class */ (function () {
    function b2ContactEdge(contact) {
        this._other = null; ///< provides quick access to the other body attached.
        this.prev = null; ///< the previous contact edge in the body's contact list
        this.next = null; ///< the next contact edge in the body's contact list
        this.contact = contact;
    }
    Object.defineProperty(b2ContactEdge.prototype, "other", {
        get: function () {
            if (this._other === null) {
                throw new Error();
            }
            return this._other;
        },
        set: function (value) {
            if (this._other !== null) {
                throw new Error();
            }
            this._other = value;
        },
        enumerable: false,
        configurable: true
    });
    b2ContactEdge.prototype.Reset = function () {
        this._other = null;
        this.prev = null;
        this.next = null;
    };
    return b2ContactEdge;
}());
exports.b2ContactEdge = b2ContactEdge;
var b2Contact = /** @class */ (function () {
    function b2Contact() {
        this.m_islandFlag = false; /// Used when crawling contact graph when forming islands.
        this.m_touchingFlag = false; /// Set when the shapes are touching.
        this.m_enabledFlag = false; /// This contact can be disabled (by user)
        this.m_filterFlag = false; /// This contact needs filtering because a fixture filter was changed.
        this.m_bulletHitFlag = false; /// This bullet contact had a TOI event
        this.m_toiFlag = false; /// This contact has a valid TOI in m_toi
        this.m_prev = null;
        this.m_next = null;
        this.m_nodeA = new b2ContactEdge(this);
        this.m_nodeB = new b2ContactEdge(this);
        this.m_indexA = 0;
        this.m_indexB = 0;
        this.m_manifold = new b2_collision_js_1.b2Manifold(); // TODO: readonly
        this.m_toiCount = 0;
        this.m_toi = 0;
        this.m_friction = 0;
        this.m_restitution = 0;
        this.m_restitutionThreshold = 0;
        this.m_tangentSpeed = 0;
        this.m_oldManifold = new b2_collision_js_1.b2Manifold(); // TODO: readonly
    }
    b2Contact.prototype.GetManifold = function () {
        return this.m_manifold;
    };
    b2Contact.prototype.GetWorldManifold = function (worldManifold) {
        var bodyA = this.m_fixtureA.GetBody();
        var bodyB = this.m_fixtureB.GetBody();
        var shapeA = this.GetShapeA();
        var shapeB = this.GetShapeB();
        worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
    };
    b2Contact.prototype.IsTouching = function () {
        return this.m_touchingFlag;
    };
    b2Contact.prototype.SetEnabled = function (flag) {
        this.m_enabledFlag = flag;
    };
    b2Contact.prototype.IsEnabled = function () {
        return this.m_enabledFlag;
    };
    b2Contact.prototype.GetNext = function () {
        return this.m_next;
    };
    b2Contact.prototype.GetFixtureA = function () {
        return this.m_fixtureA;
    };
    b2Contact.prototype.GetChildIndexA = function () {
        return this.m_indexA;
    };
    b2Contact.prototype.GetShapeA = function () {
        return this.m_fixtureA.GetShape();
    };
    b2Contact.prototype.GetFixtureB = function () {
        return this.m_fixtureB;
    };
    b2Contact.prototype.GetChildIndexB = function () {
        return this.m_indexB;
    };
    b2Contact.prototype.GetShapeB = function () {
        return this.m_fixtureB.GetShape();
    };
    b2Contact.prototype.FlagForFiltering = function () {
        this.m_filterFlag = true;
    };
    b2Contact.prototype.SetFriction = function (friction) {
        this.m_friction = friction;
    };
    b2Contact.prototype.GetFriction = function () {
        return this.m_friction;
    };
    b2Contact.prototype.ResetFriction = function () {
        this.m_friction = b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
    };
    b2Contact.prototype.SetRestitution = function (restitution) {
        this.m_restitution = restitution;
    };
    b2Contact.prototype.GetRestitution = function () {
        return this.m_restitution;
    };
    b2Contact.prototype.ResetRestitution = function () {
        this.m_restitution = b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
    };
    /// Override the default restitution velocity threshold mixture. You can call this in b2ContactListener::PreSolve.
    /// The value persists until you set or reset.
    b2Contact.prototype.SetRestitutionThreshold = function (threshold) {
        this.m_restitutionThreshold = threshold;
    };
    /// Get the restitution threshold.
    b2Contact.prototype.GetRestitutionThreshold = function () {
        return this.m_restitutionThreshold;
    };
    /// Reset the restitution threshold to the default value.
    b2Contact.prototype.ResetRestitutionThreshold = function () {
        this.m_restitutionThreshold = b2MixRestitutionThreshold(this.m_fixtureA.m_restitutionThreshold, this.m_fixtureB.m_restitutionThreshold);
    };
    b2Contact.prototype.SetTangentSpeed = function (speed) {
        this.m_tangentSpeed = speed;
    };
    b2Contact.prototype.GetTangentSpeed = function () {
        return this.m_tangentSpeed;
    };
    b2Contact.prototype.Reset = function (fixtureA, indexA, fixtureB, indexB) {
        this.m_islandFlag = false;
        this.m_touchingFlag = false;
        this.m_enabledFlag = true;
        this.m_filterFlag = false;
        this.m_bulletHitFlag = false;
        this.m_toiFlag = false;
        this.m_fixtureA = fixtureA;
        this.m_fixtureB = fixtureB;
        this.m_indexA = indexA;
        this.m_indexB = indexB;
        this.m_manifold.pointCount = 0;
        this.m_prev = null;
        this.m_next = null;
        this.m_nodeA.Reset();
        this.m_nodeB.Reset();
        this.m_toiCount = 0;
        this.m_friction = b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
        this.m_restitution = b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
        this.m_restitutionThreshold = b2MixRestitutionThreshold(this.m_fixtureA.m_restitutionThreshold, this.m_fixtureB.m_restitutionThreshold);
    };
    b2Contact.prototype.Update = function (listener) {
        var tManifold = this.m_oldManifold;
        this.m_oldManifold = this.m_manifold;
        this.m_manifold = tManifold;
        // Re-enable this contact.
        this.m_enabledFlag = true;
        var touching = false;
        var wasTouching = this.m_touchingFlag;
        var sensorA = this.m_fixtureA.IsSensor();
        var sensorB = this.m_fixtureB.IsSensor();
        var sensor = sensorA || sensorB;
        var bodyA = this.m_fixtureA.GetBody();
        var bodyB = this.m_fixtureB.GetBody();
        var xfA = bodyA.GetTransform();
        var xfB = bodyB.GetTransform();
        // Is this contact a sensor?
        if (sensor) {
            var shapeA = this.GetShapeA();
            var shapeB = this.GetShapeB();
            touching = b2_collision_js_2.b2TestOverlapShape(shapeA, this.m_indexA, shapeB, this.m_indexB, xfA, xfB);
            // Sensors don't generate manifolds.
            this.m_manifold.pointCount = 0;
        }
        else {
            this.Evaluate(this.m_manifold, xfA, xfB);
            touching = this.m_manifold.pointCount > 0;
            // Match old contact ids to new contact ids and copy the
            // stored impulses to warm start the solver.
            for (var i = 0; i < this.m_manifold.pointCount; ++i) {
                var mp2 = this.m_manifold.points[i];
                mp2.normalImpulse = 0;
                mp2.tangentImpulse = 0;
                var id2 = mp2.id;
                for (var j = 0; j < this.m_oldManifold.pointCount; ++j) {
                    var mp1 = this.m_oldManifold.points[j];
                    if (mp1.id.key === id2.key) {
                        mp2.normalImpulse = mp1.normalImpulse;
                        mp2.tangentImpulse = mp1.tangentImpulse;
                        break;
                    }
                }
            }
            if (touching !== wasTouching) {
                bodyA.SetAwake(true);
                bodyB.SetAwake(true);
            }
        }
        this.m_touchingFlag = touching;
        if (!wasTouching && touching && listener) {
            listener.BeginContact(this);
        }
        if (wasTouching && !touching && listener) {
            listener.EndContact(this);
        }
        if (!sensor && touching && listener) {
            listener.PreSolve(this, this.m_oldManifold);
        }
    };
    b2Contact.prototype.ComputeTOI = function (sweepA, sweepB) {
        var input = b2Contact.ComputeTOI_s_input;
        input.proxyA.SetShape(this.GetShapeA(), this.m_indexA);
        input.proxyB.SetShape(this.GetShapeB(), this.m_indexB);
        input.sweepA.Copy(sweepA);
        input.sweepB.Copy(sweepB);
        input.tMax = b2_settings_js_1.b2_linearSlop;
        var output = b2Contact.ComputeTOI_s_output;
        b2_time_of_impact_js_1.b2TimeOfImpact(output, input);
        return output.t;
    };
    b2Contact.ComputeTOI_s_input = new b2_time_of_impact_js_1.b2TOIInput();
    b2Contact.ComputeTOI_s_output = new b2_time_of_impact_js_1.b2TOIOutput();
    return b2Contact;
}());
exports.b2Contact = b2Contact;
