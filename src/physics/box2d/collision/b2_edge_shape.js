"use strict";
/*
* Copyright (c) 2006-2010 Erin Catto http://www.box2d.org
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
exports.b2EdgeShape = void 0;
// DEBUG: import { b2Assert } from "../common/b2_settings";
var b2_settings_js_1 = require("../common/b2_settings.js");
var b2_math_js_1 = require("../common/b2_math.js");
var b2_shape_js_1 = require("./b2_shape.js");
/// A line segment (edge) shape. These can be connected in chains or loops
/// to other edge shapes. Edges created independently are two-sided and do
/// no provide smooth movement across junctions.
var b2EdgeShape = /** @class */ (function (_super) {
    __extends(b2EdgeShape, _super);
    function b2EdgeShape() {
        var _this = _super.call(this, b2_shape_js_1.b2ShapeType.e_edgeShape, b2_settings_js_1.b2_polygonRadius) || this;
        _this.m_vertex1 = new b2_math_js_1.b2Vec2();
        _this.m_vertex2 = new b2_math_js_1.b2Vec2();
        _this.m_vertex0 = new b2_math_js_1.b2Vec2();
        _this.m_vertex3 = new b2_math_js_1.b2Vec2();
        /// Uses m_vertex0 and m_vertex3 to create smooth collision.
        _this.m_oneSided = false;
        return _this;
    }
    /// Set this as a part of a sequence. Vertex v0 precedes the edge and vertex v3
    /// follows. These extra vertices are used to provide smooth movement
    /// across junctions. This also makes the collision one-sided. The edge
    /// normal points to the right looking from v1 to v2.
    // void SetOneSided(const b2Vec2& v0, const b2Vec2& v1,const b2Vec2& v2, const b2Vec2& v3);
    b2EdgeShape.prototype.SetOneSided = function (v0, v1, v2, v3) {
        this.m_vertex0.Copy(v0);
        this.m_vertex1.Copy(v1);
        this.m_vertex2.Copy(v2);
        this.m_vertex3.Copy(v3);
        this.m_oneSided = true;
        return this;
    };
    /// Set this as an isolated edge. Collision is two-sided.
    b2EdgeShape.prototype.SetTwoSided = function (v1, v2) {
        this.m_vertex1.Copy(v1);
        this.m_vertex2.Copy(v2);
        this.m_oneSided = false;
        return this;
    };
    /// Implement b2Shape.
    b2EdgeShape.prototype.Clone = function () {
        return new b2EdgeShape().Copy(this);
    };
    b2EdgeShape.prototype.Copy = function (other) {
        _super.prototype.Copy.call(this, other);
        // DEBUG: b2Assert(other instanceof b2EdgeShape);
        this.m_vertex1.Copy(other.m_vertex1);
        this.m_vertex2.Copy(other.m_vertex2);
        this.m_vertex0.Copy(other.m_vertex0);
        this.m_vertex3.Copy(other.m_vertex3);
        this.m_oneSided = other.m_oneSided;
        return this;
    };
    /// @see b2Shape::GetChildCount
    b2EdgeShape.prototype.GetChildCount = function () {
        return 1;
    };
    /// @see b2Shape::TestPoint
    b2EdgeShape.prototype.TestPoint = function (xf, p) {
        return false;
    };
    b2EdgeShape.prototype.ComputeDistance = function (xf, p, normal, childIndex) {
        var v1 = b2_math_js_1.b2Transform.MulXV(xf, this.m_vertex1, b2EdgeShape.ComputeDistance_s_v1);
        var v2 = b2_math_js_1.b2Transform.MulXV(xf, this.m_vertex2, b2EdgeShape.ComputeDistance_s_v2);
        var d = b2_math_js_1.b2Vec2.SubVV(p, v1, b2EdgeShape.ComputeDistance_s_d);
        var s = b2_math_js_1.b2Vec2.SubVV(v2, v1, b2EdgeShape.ComputeDistance_s_s);
        var ds = b2_math_js_1.b2Vec2.DotVV(d, s);
        if (ds > 0) {
            var s2 = b2_math_js_1.b2Vec2.DotVV(s, s);
            if (ds > s2) {
                b2_math_js_1.b2Vec2.SubVV(p, v2, d);
            }
            else {
                d.SelfMulSub(ds / s2, s);
            }
        }
        normal.Copy(d);
        return normal.Normalize();
    };
    b2EdgeShape.prototype.RayCast = function (output, input, xf, childIndex) {
        // Put the ray into the edge's frame of reference.
        var p1 = b2_math_js_1.b2Transform.MulTXV(xf, input.p1, b2EdgeShape.RayCast_s_p1);
        var p2 = b2_math_js_1.b2Transform.MulTXV(xf, input.p2, b2EdgeShape.RayCast_s_p2);
        var d = b2_math_js_1.b2Vec2.SubVV(p2, p1, b2EdgeShape.RayCast_s_d);
        var v1 = this.m_vertex1;
        var v2 = this.m_vertex2;
        var e = b2_math_js_1.b2Vec2.SubVV(v2, v1, b2EdgeShape.RayCast_s_e);
        // Normal points to the right, looking from v1 at v2
        var normal = output.normal.Set(e.y, -e.x).SelfNormalize();
        // q = p1 + t * d
        // dot(normal, q - v1) = 0
        // dot(normal, p1 - v1) + t * dot(normal, d) = 0
        var numerator = b2_math_js_1.b2Vec2.DotVV(normal, b2_math_js_1.b2Vec2.SubVV(v1, p1, b2_math_js_1.b2Vec2.s_t0));
        if (this.m_oneSided && numerator > 0.0) {
            return false;
        }
        var denominator = b2_math_js_1.b2Vec2.DotVV(normal, d);
        if (denominator === 0) {
            return false;
        }
        var t = numerator / denominator;
        if (t < 0 || input.maxFraction < t) {
            return false;
        }
        var q = b2_math_js_1.b2Vec2.AddVMulSV(p1, t, d, b2EdgeShape.RayCast_s_q);
        // q = v1 + s * r
        // s = dot(q - v1, r) / dot(r, r)
        var r = b2_math_js_1.b2Vec2.SubVV(v2, v1, b2EdgeShape.RayCast_s_r);
        var rr = b2_math_js_1.b2Vec2.DotVV(r, r);
        if (rr === 0) {
            return false;
        }
        var s = b2_math_js_1.b2Vec2.DotVV(b2_math_js_1.b2Vec2.SubVV(q, v1, b2_math_js_1.b2Vec2.s_t0), r) / rr;
        if (s < 0 || 1 < s) {
            return false;
        }
        output.fraction = t;
        b2_math_js_1.b2Rot.MulRV(xf.q, output.normal, output.normal);
        if (numerator > 0) {
            output.normal.SelfNeg();
        }
        return true;
    };
    b2EdgeShape.prototype.ComputeAABB = function (aabb, xf, childIndex) {
        var v1 = b2_math_js_1.b2Transform.MulXV(xf, this.m_vertex1, b2EdgeShape.ComputeAABB_s_v1);
        var v2 = b2_math_js_1.b2Transform.MulXV(xf, this.m_vertex2, b2EdgeShape.ComputeAABB_s_v2);
        b2_math_js_1.b2Vec2.MinV(v1, v2, aabb.lowerBound);
        b2_math_js_1.b2Vec2.MaxV(v1, v2, aabb.upperBound);
        var r = this.m_radius;
        aabb.lowerBound.SelfSubXY(r, r);
        aabb.upperBound.SelfAddXY(r, r);
    };
    /// @see b2Shape::ComputeMass
    b2EdgeShape.prototype.ComputeMass = function (massData, density) {
        massData.mass = 0;
        b2_math_js_1.b2Vec2.MidVV(this.m_vertex1, this.m_vertex2, massData.center);
        massData.I = 0;
    };
    b2EdgeShape.prototype.SetupDistanceProxy = function (proxy, index) {
        proxy.m_vertices = proxy.m_buffer;
        proxy.m_vertices[0].Copy(this.m_vertex1);
        proxy.m_vertices[1].Copy(this.m_vertex2);
        proxy.m_count = 2;
        proxy.m_radius = this.m_radius;
    };
    b2EdgeShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
        c.SetZero();
        return 0;
    };
    b2EdgeShape.prototype.Dump = function (log) {
        log("    const shape: b2EdgeShape = new b2EdgeShape();\n");
        log("    shape.m_radius = %.15f;\n", this.m_radius);
        log("    shape.m_vertex0.Set(%.15f, %.15f);\n", this.m_vertex0.x, this.m_vertex0.y);
        log("    shape.m_vertex1.Set(%.15f, %.15f);\n", this.m_vertex1.x, this.m_vertex1.y);
        log("    shape.m_vertex2.Set(%.15f, %.15f);\n", this.m_vertex2.x, this.m_vertex2.y);
        log("    shape.m_vertex3.Set(%.15f, %.15f);\n", this.m_vertex3.x, this.m_vertex3.y);
        log("    shape.m_oneSided = %s;\n", this.m_oneSided);
    };
    // #if B2_ENABLE_PARTICLE
    /// @see b2Shape::ComputeDistance
    b2EdgeShape.ComputeDistance_s_v1 = new b2_math_js_1.b2Vec2();
    b2EdgeShape.ComputeDistance_s_v2 = new b2_math_js_1.b2Vec2();
    b2EdgeShape.ComputeDistance_s_d = new b2_math_js_1.b2Vec2();
    b2EdgeShape.ComputeDistance_s_s = new b2_math_js_1.b2Vec2();
    // #endif
    /// Implement b2Shape.
    // p = p1 + t * d
    // v = v1 + s * e
    // p1 + t * d = v1 + s * e
    // s * e - t * d = p1 - v1
    b2EdgeShape.RayCast_s_p1 = new b2_math_js_1.b2Vec2();
    b2EdgeShape.RayCast_s_p2 = new b2_math_js_1.b2Vec2();
    b2EdgeShape.RayCast_s_d = new b2_math_js_1.b2Vec2();
    b2EdgeShape.RayCast_s_e = new b2_math_js_1.b2Vec2();
    b2EdgeShape.RayCast_s_q = new b2_math_js_1.b2Vec2();
    b2EdgeShape.RayCast_s_r = new b2_math_js_1.b2Vec2();
    /// @see b2Shape::ComputeAABB
    b2EdgeShape.ComputeAABB_s_v1 = new b2_math_js_1.b2Vec2();
    b2EdgeShape.ComputeAABB_s_v2 = new b2_math_js_1.b2Vec2();
    return b2EdgeShape;
}(b2_shape_js_1.b2Shape));
exports.b2EdgeShape = b2EdgeShape;
