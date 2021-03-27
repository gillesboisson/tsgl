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
exports.b2CircleShape = void 0;
// DEBUG: import { b2Assert } from "../common/b2_settings";
var b2_settings_js_1 = require("../common/b2_settings.js");
var b2_math_js_1 = require("../common/b2_math.js");
var b2_shape_js_1 = require("./b2_shape.js");
/// A solid circle shape
var b2CircleShape = /** @class */ (function (_super) {
    __extends(b2CircleShape, _super);
    function b2CircleShape(radius) {
        if (radius === void 0) { radius = 0; }
        var _this = _super.call(this, b2_shape_js_1.b2ShapeType.e_circleShape, radius) || this;
        _this.m_p = new b2_math_js_1.b2Vec2();
        return _this;
    }
    b2CircleShape.prototype.Set = function (position, radius) {
        if (radius === void 0) { radius = this.m_radius; }
        this.m_p.Copy(position);
        this.m_radius = radius;
        return this;
    };
    /// Implement b2Shape.
    b2CircleShape.prototype.Clone = function () {
        return new b2CircleShape().Copy(this);
    };
    b2CircleShape.prototype.Copy = function (other) {
        _super.prototype.Copy.call(this, other);
        // DEBUG: b2Assert(other instanceof b2CircleShape);
        this.m_p.Copy(other.m_p);
        return this;
    };
    /// @see b2Shape::GetChildCount
    b2CircleShape.prototype.GetChildCount = function () {
        return 1;
    };
    b2CircleShape.prototype.TestPoint = function (transform, p) {
        var center = b2_math_js_1.b2Transform.MulXV(transform, this.m_p, b2CircleShape.TestPoint_s_center);
        var d = b2_math_js_1.b2Vec2.SubVV(p, center, b2CircleShape.TestPoint_s_d);
        return b2_math_js_1.b2Vec2.DotVV(d, d) <= b2_math_js_1.b2Sq(this.m_radius);
    };
    b2CircleShape.prototype.ComputeDistance = function (xf, p, normal, childIndex) {
        var center = b2_math_js_1.b2Transform.MulXV(xf, this.m_p, b2CircleShape.ComputeDistance_s_center);
        b2_math_js_1.b2Vec2.SubVV(p, center, normal);
        return normal.Normalize() - this.m_radius;
    };
    b2CircleShape.prototype.RayCast = function (output, input, transform, childIndex) {
        var position = b2_math_js_1.b2Transform.MulXV(transform, this.m_p, b2CircleShape.RayCast_s_position);
        var s = b2_math_js_1.b2Vec2.SubVV(input.p1, position, b2CircleShape.RayCast_s_s);
        var b = b2_math_js_1.b2Vec2.DotVV(s, s) - b2_math_js_1.b2Sq(this.m_radius);
        // Solve quadratic equation.
        var r = b2_math_js_1.b2Vec2.SubVV(input.p2, input.p1, b2CircleShape.RayCast_s_r);
        var c = b2_math_js_1.b2Vec2.DotVV(s, r);
        var rr = b2_math_js_1.b2Vec2.DotVV(r, r);
        var sigma = c * c - rr * b;
        // Check for negative discriminant and short segment.
        if (sigma < 0 || rr < b2_settings_js_1.b2_epsilon) {
            return false;
        }
        // Find the point of intersection of the line with the circle.
        var a = (-(c + b2_math_js_1.b2Sqrt(sigma)));
        // Is the intersection point on the segment?
        if (0 <= a && a <= input.maxFraction * rr) {
            a /= rr;
            output.fraction = a;
            b2_math_js_1.b2Vec2.AddVMulSV(s, a, r, output.normal).SelfNormalize();
            return true;
        }
        return false;
    };
    b2CircleShape.prototype.ComputeAABB = function (aabb, transform, childIndex) {
        var p = b2_math_js_1.b2Transform.MulXV(transform, this.m_p, b2CircleShape.ComputeAABB_s_p);
        aabb.lowerBound.Set(p.x - this.m_radius, p.y - this.m_radius);
        aabb.upperBound.Set(p.x + this.m_radius, p.y + this.m_radius);
    };
    /// @see b2Shape::ComputeMass
    b2CircleShape.prototype.ComputeMass = function (massData, density) {
        var radius_sq = b2_math_js_1.b2Sq(this.m_radius);
        massData.mass = density * b2_settings_js_1.b2_pi * radius_sq;
        massData.center.Copy(this.m_p);
        // inertia about the local origin
        massData.I = massData.mass * (0.5 * radius_sq + b2_math_js_1.b2Vec2.DotVV(this.m_p, this.m_p));
    };
    b2CircleShape.prototype.SetupDistanceProxy = function (proxy, index) {
        proxy.m_vertices = proxy.m_buffer;
        proxy.m_vertices[0].Copy(this.m_p);
        proxy.m_count = 1;
        proxy.m_radius = this.m_radius;
    };
    b2CircleShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
        var p = b2_math_js_1.b2Transform.MulXV(xf, this.m_p, new b2_math_js_1.b2Vec2());
        var l = (-(b2_math_js_1.b2Vec2.DotVV(normal, p) - offset));
        if (l < (-this.m_radius) + b2_settings_js_1.b2_epsilon) {
            // Completely dry
            return 0;
        }
        if (l > this.m_radius) {
            // Completely wet
            c.Copy(p);
            return b2_settings_js_1.b2_pi * this.m_radius * this.m_radius;
        }
        // Magic
        var r2 = this.m_radius * this.m_radius;
        var l2 = l * l;
        var area = r2 * (b2_math_js_1.b2Asin(l / this.m_radius) + b2_settings_js_1.b2_pi / 2) + l * b2_math_js_1.b2Sqrt(r2 - l2);
        var com = (-2 / 3 * b2_math_js_1.b2Pow(r2 - l2, 1.5) / area);
        c.x = p.x + normal.x * com;
        c.y = p.y + normal.y * com;
        return area;
    };
    b2CircleShape.prototype.Dump = function (log) {
        log("    const shape: b2CircleShape = new b2CircleShape();\n");
        log("    shape.m_radius = %.15f;\n", this.m_radius);
        log("    shape.m_p.Set(%.15f, %.15f);\n", this.m_p.x, this.m_p.y);
    };
    /// Implement b2Shape.
    b2CircleShape.TestPoint_s_center = new b2_math_js_1.b2Vec2();
    b2CircleShape.TestPoint_s_d = new b2_math_js_1.b2Vec2();
    // #if B2_ENABLE_PARTICLE
    /// @see b2Shape::ComputeDistance
    b2CircleShape.ComputeDistance_s_center = new b2_math_js_1.b2Vec2();
    // #endif
    /// Implement b2Shape.
    /// @note because the circle is solid, rays that start inside do not hit because the normal is
    /// not defined.
    // Collision Detection in Interactive 3D Environments by Gino van den Bergen
    // From Section 3.1.2
    // x = s + a * r
    // norm(x) = radius
    b2CircleShape.RayCast_s_position = new b2_math_js_1.b2Vec2();
    b2CircleShape.RayCast_s_s = new b2_math_js_1.b2Vec2();
    b2CircleShape.RayCast_s_r = new b2_math_js_1.b2Vec2();
    /// @see b2Shape::ComputeAABB
    b2CircleShape.ComputeAABB_s_p = new b2_math_js_1.b2Vec2();
    return b2CircleShape;
}(b2_shape_js_1.b2Shape));
exports.b2CircleShape = b2CircleShape;
