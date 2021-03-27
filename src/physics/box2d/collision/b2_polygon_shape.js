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
exports.b2PolygonShape = void 0;
// DEBUG: import { b2Assert, b2_epsilon_sq } from "../common/b2_settings";
var b2_settings_js_1 = require("../common/b2_settings.js");
var b2_math_js_1 = require("../common/b2_math.js");
var b2_shape_js_1 = require("./b2_shape.js");
var b2_shape_js_2 = require("./b2_shape.js");
/// A solid convex polygon. It is assumed that the interior of the polygon is to
/// the left of each edge.
/// In most cases you should not need many vertices for a convex polygon.
var b2PolygonShape = /** @class */ (function (_super) {
    __extends(b2PolygonShape, _super);
    function b2PolygonShape() {
        var _this = _super.call(this, b2_shape_js_2.b2ShapeType.e_polygonShape, b2_settings_js_1.b2_polygonRadius) || this;
        _this.m_centroid = new b2_math_js_1.b2Vec2(0, 0);
        _this.m_vertices = [];
        _this.m_normals = [];
        _this.m_count = 0;
        return _this;
    }
    /// Implement b2Shape.
    b2PolygonShape.prototype.Clone = function () {
        return new b2PolygonShape().Copy(this);
    };
    b2PolygonShape.prototype.Copy = function (other) {
        _super.prototype.Copy.call(this, other);
        // DEBUG: b2Assert(other instanceof b2PolygonShape);
        this.m_centroid.Copy(other.m_centroid);
        this.m_count = other.m_count;
        this.m_vertices = b2_math_js_1.b2Vec2.MakeArray(this.m_count);
        this.m_normals = b2_math_js_1.b2Vec2.MakeArray(this.m_count);
        for (var i = 0; i < this.m_count; ++i) {
            this.m_vertices[i].Copy(other.m_vertices[i]);
            this.m_normals[i].Copy(other.m_normals[i]);
        }
        return this;
    };
    /// @see b2Shape::GetChildCount
    b2PolygonShape.prototype.GetChildCount = function () {
        return 1;
    };
    b2PolygonShape.prototype.Set = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (typeof args[0][0] === "number") {
            var vertices_1 = args[0];
            if (vertices_1.length % 2 !== 0) {
                throw new Error();
            }
            return this._Set(function (index) { return ({ x: vertices_1[index * 2], y: vertices_1[index * 2 + 1] }); }, vertices_1.length / 2);
        }
        else {
            var vertices_2 = args[0];
            var count = args[1] || vertices_2.length;
            return this._Set(function (index) { return vertices_2[index]; }, count);
        }
    };
    b2PolygonShape.prototype._Set = function (vertices, count) {
        // DEBUG: b2Assert(3 <= count);
        if (count < 3) {
            return this.SetAsBox(1, 1);
        }
        var n = count;
        // Perform welding and copy vertices into local buffer.
        var ps = [];
        for (var i = 0; i < n; ++i) {
            var /*b2Vec2*/ v = vertices(i);
            var /*bool*/ unique = true;
            for (var /*int32*/ j = 0; j < ps.length; ++j) {
                if (b2_math_js_1.b2Vec2.DistanceSquaredVV(v, ps[j]) < ((0.5 * b2_settings_js_1.b2_linearSlop) * (0.5 * b2_settings_js_1.b2_linearSlop))) {
                    unique = false;
                    break;
                }
            }
            if (unique) {
                ps.push(v);
            }
        }
        n = ps.length;
        if (n < 3) {
            // Polygon is degenerate.
            // DEBUG: b2Assert(false);
            return this.SetAsBox(1.0, 1.0);
        }
        // Create the convex hull using the Gift wrapping algorithm
        // http://en.wikipedia.org/wiki/Gift_wrapping_algorithm
        // Find the right most point on the hull
        var i0 = 0;
        var x0 = ps[0].x;
        for (var i = 1; i < n; ++i) {
            var x = ps[i].x;
            if (x > x0 || (x === x0 && ps[i].y < ps[i0].y)) {
                i0 = i;
                x0 = x;
            }
        }
        var hull = [];
        var m = 0;
        var ih = i0;
        for (;;) {
            hull[m] = ih;
            var ie = 0;
            for (var j = 1; j < n; ++j) {
                if (ie === ih) {
                    ie = j;
                    continue;
                }
                var r = b2_math_js_1.b2Vec2.SubVV(ps[ie], ps[hull[m]], b2PolygonShape.Set_s_r);
                var v = b2_math_js_1.b2Vec2.SubVV(ps[j], ps[hull[m]], b2PolygonShape.Set_s_v);
                var c = b2_math_js_1.b2Vec2.CrossVV(r, v);
                if (c < 0) {
                    ie = j;
                }
                // Collinearity check
                if (c === 0 && v.LengthSquared() > r.LengthSquared()) {
                    ie = j;
                }
            }
            ++m;
            ih = ie;
            if (ie === i0) {
                break;
            }
        }
        this.m_count = m;
        this.m_vertices = b2_math_js_1.b2Vec2.MakeArray(this.m_count);
        this.m_normals = b2_math_js_1.b2Vec2.MakeArray(this.m_count);
        // Copy vertices.
        for (var i = 0; i < m; ++i) {
            this.m_vertices[i].Copy(ps[hull[i]]);
        }
        // Compute normals. Ensure the edges have non-zero length.
        for (var i = 0; i < m; ++i) {
            var vertexi1 = this.m_vertices[i];
            var vertexi2 = this.m_vertices[(i + 1) % m];
            var edge = b2_math_js_1.b2Vec2.SubVV(vertexi2, vertexi1, b2_math_js_1.b2Vec2.s_t0); // edge uses s_t0
            // DEBUG: b2Assert(edge.LengthSquared() > b2_epsilon_sq);
            b2_math_js_1.b2Vec2.CrossVOne(edge, this.m_normals[i]).SelfNormalize();
        }
        // Compute the polygon centroid.
        b2PolygonShape.ComputeCentroid(this.m_vertices, m, this.m_centroid);
        return this;
    };
    /// Build vertices to represent an axis-aligned box or an oriented box.
    /// @param hx the half-width.
    /// @param hy the half-height.
    /// @param center the center of the box in local coordinates.
    /// @param angle the rotation of the box in local coordinates.
    b2PolygonShape.prototype.SetAsBox = function (hx, hy, center, angle) {
        if (angle === void 0) { angle = 0; }
        this.m_count = 4;
        this.m_vertices = b2_math_js_1.b2Vec2.MakeArray(this.m_count);
        this.m_normals = b2_math_js_1.b2Vec2.MakeArray(this.m_count);
        this.m_vertices[0].Set((-hx), (-hy));
        this.m_vertices[1].Set(hx, (-hy));
        this.m_vertices[2].Set(hx, hy);
        this.m_vertices[3].Set((-hx), hy);
        this.m_normals[0].Set(0, (-1));
        this.m_normals[1].Set(1, 0);
        this.m_normals[2].Set(0, 1);
        this.m_normals[3].Set((-1), 0);
        this.m_centroid.SetZero();
        if (center) {
            this.m_centroid.Copy(center);
            var xf = new b2_math_js_1.b2Transform();
            xf.SetPosition(center);
            xf.SetRotationAngle(angle);
            // Transform vertices and normals.
            for (var i = 0; i < this.m_count; ++i) {
                b2_math_js_1.b2Transform.MulXV(xf, this.m_vertices[i], this.m_vertices[i]);
                b2_math_js_1.b2Rot.MulRV(xf.q, this.m_normals[i], this.m_normals[i]);
            }
        }
        return this;
    };
    b2PolygonShape.prototype.TestPoint = function (xf, p) {
        var pLocal = b2_math_js_1.b2Transform.MulTXV(xf, p, b2PolygonShape.TestPoint_s_pLocal);
        for (var i = 0; i < this.m_count; ++i) {
            var dot = b2_math_js_1.b2Vec2.DotVV(this.m_normals[i], b2_math_js_1.b2Vec2.SubVV(pLocal, this.m_vertices[i], b2_math_js_1.b2Vec2.s_t0));
            if (dot > 0) {
                return false;
            }
        }
        return true;
    };
    b2PolygonShape.prototype.ComputeDistance = function (xf, p, normal, childIndex) {
        var pLocal = b2_math_js_1.b2Transform.MulTXV(xf, p, b2PolygonShape.ComputeDistance_s_pLocal);
        var maxDistance = -b2_settings_js_1.b2_maxFloat;
        var normalForMaxDistance = b2PolygonShape.ComputeDistance_s_normalForMaxDistance.Copy(pLocal);
        for (var i = 0; i < this.m_count; ++i) {
            var dot = b2_math_js_1.b2Vec2.DotVV(this.m_normals[i], b2_math_js_1.b2Vec2.SubVV(pLocal, this.m_vertices[i], b2_math_js_1.b2Vec2.s_t0));
            if (dot > maxDistance) {
                maxDistance = dot;
                normalForMaxDistance.Copy(this.m_normals[i]);
            }
        }
        if (maxDistance > 0) {
            var minDistance = b2PolygonShape.ComputeDistance_s_minDistance.Copy(normalForMaxDistance);
            var minDistance2 = maxDistance * maxDistance;
            for (var i = 0; i < this.m_count; ++i) {
                var distance = b2_math_js_1.b2Vec2.SubVV(pLocal, this.m_vertices[i], b2PolygonShape.ComputeDistance_s_distance);
                var distance2 = distance.LengthSquared();
                if (minDistance2 > distance2) {
                    minDistance.Copy(distance);
                    minDistance2 = distance2;
                }
            }
            b2_math_js_1.b2Rot.MulRV(xf.q, minDistance, normal);
            normal.Normalize();
            return Math.sqrt(minDistance2);
        }
        else {
            b2_math_js_1.b2Rot.MulRV(xf.q, normalForMaxDistance, normal);
            return maxDistance;
        }
    };
    b2PolygonShape.prototype.RayCast = function (output, input, xf, childIndex) {
        // Put the ray into the polygon's frame of reference.
        var p1 = b2_math_js_1.b2Transform.MulTXV(xf, input.p1, b2PolygonShape.RayCast_s_p1);
        var p2 = b2_math_js_1.b2Transform.MulTXV(xf, input.p2, b2PolygonShape.RayCast_s_p2);
        var d = b2_math_js_1.b2Vec2.SubVV(p2, p1, b2PolygonShape.RayCast_s_d);
        var lower = 0, upper = input.maxFraction;
        var index = -1;
        for (var i = 0; i < this.m_count; ++i) {
            // p = p1 + a * d
            // dot(normal, p - v) = 0
            // dot(normal, p1 - v) + a * dot(normal, d) = 0
            var numerator = b2_math_js_1.b2Vec2.DotVV(this.m_normals[i], b2_math_js_1.b2Vec2.SubVV(this.m_vertices[i], p1, b2_math_js_1.b2Vec2.s_t0));
            var denominator = b2_math_js_1.b2Vec2.DotVV(this.m_normals[i], d);
            if (denominator === 0) {
                if (numerator < 0) {
                    return false;
                }
            }
            else {
                // Note: we want this predicate without division:
                // lower < numerator / denominator, where denominator < 0
                // Since denominator < 0, we have to flip the inequality:
                // lower < numerator / denominator <==> denominator * lower > numerator.
                if (denominator < 0 && numerator < lower * denominator) {
                    // Increase lower.
                    // The segment enters this half-space.
                    lower = numerator / denominator;
                    index = i;
                }
                else if (denominator > 0 && numerator < upper * denominator) {
                    // Decrease upper.
                    // The segment exits this half-space.
                    upper = numerator / denominator;
                }
            }
            // The use of epsilon here causes the assert on lower to trip
            // in some cases. Apparently the use of epsilon was to make edge
            // shapes work, but now those are handled separately.
            // if (upper < lower - b2_epsilon)
            if (upper < lower) {
                return false;
            }
        }
        // DEBUG: b2Assert(0 <= lower && lower <= input.maxFraction);
        if (index >= 0) {
            output.fraction = lower;
            b2_math_js_1.b2Rot.MulRV(xf.q, this.m_normals[index], output.normal);
            return true;
        }
        return false;
    };
    b2PolygonShape.prototype.ComputeAABB = function (aabb, xf, childIndex) {
        var lower = b2_math_js_1.b2Transform.MulXV(xf, this.m_vertices[0], aabb.lowerBound);
        var upper = aabb.upperBound.Copy(lower);
        for (var i = 0; i < this.m_count; ++i) {
            var v = b2_math_js_1.b2Transform.MulXV(xf, this.m_vertices[i], b2PolygonShape.ComputeAABB_s_v);
            b2_math_js_1.b2Vec2.MinV(v, lower, lower);
            b2_math_js_1.b2Vec2.MaxV(v, upper, upper);
        }
        var r = this.m_radius;
        lower.SelfSubXY(r, r);
        upper.SelfAddXY(r, r);
    };
    b2PolygonShape.prototype.ComputeMass = function (massData, density) {
        // Polygon mass, centroid, and inertia.
        // Let rho be the polygon density in mass per unit area.
        // Then:
        // mass = rho * int(dA)
        // centroid.x = (1/mass) * rho * int(x * dA)
        // centroid.y = (1/mass) * rho * int(y * dA)
        // I = rho * int((x*x + y*y) * dA)
        //
        // We can compute these integrals by summing all the integrals
        // for each triangle of the polygon. To evaluate the integral
        // for a single triangle, we make a change of variables to
        // the (u,v) coordinates of the triangle:
        // x = x0 + e1x * u + e2x * v
        // y = y0 + e1y * u + e2y * v
        // where 0 <= u && 0 <= v && u + v <= 1.
        //
        // We integrate u from [0,1-v] and then v from [0,1].
        // We also need to use the Jacobian of the transformation:
        // D = cross(e1, e2)
        //
        // Simplification: triangle centroid = (1/3) * (p1 + p2 + p3)
        //
        // The rest of the derivation is handled by computer algebra.
        // DEBUG: b2Assert(this.m_count >= 3);
        var center = b2PolygonShape.ComputeMass_s_center.SetZero();
        var area = 0;
        var I = 0;
        // Get a reference point for forming triangles.
        // Use the first vertex to reduce round-off errors.
        var s = b2PolygonShape.ComputeMass_s_s.Copy(this.m_vertices[0]);
        var k_inv3 = 1 / 3;
        for (var i = 0; i < this.m_count; ++i) {
            // Triangle vertices.
            var e1 = b2_math_js_1.b2Vec2.SubVV(this.m_vertices[i], s, b2PolygonShape.ComputeMass_s_e1);
            var e2 = b2_math_js_1.b2Vec2.SubVV(this.m_vertices[(i + 1) % this.m_count], s, b2PolygonShape.ComputeMass_s_e2);
            var D = b2_math_js_1.b2Vec2.CrossVV(e1, e2);
            var triangleArea = 0.5 * D;
            area += triangleArea;
            // Area weighted centroid
            center.SelfAdd(b2_math_js_1.b2Vec2.MulSV(triangleArea * k_inv3, b2_math_js_1.b2Vec2.AddVV(e1, e2, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.s_t1));
            var ex1 = e1.x;
            var ey1 = e1.y;
            var ex2 = e2.x;
            var ey2 = e2.y;
            var intx2 = ex1 * ex1 + ex2 * ex1 + ex2 * ex2;
            var inty2 = ey1 * ey1 + ey2 * ey1 + ey2 * ey2;
            I += (0.25 * k_inv3 * D) * (intx2 + inty2);
        }
        // Total mass
        massData.mass = density * area;
        // Center of mass
        // DEBUG: b2Assert(area > b2_epsilon);
        center.SelfMul(1 / area);
        b2_math_js_1.b2Vec2.AddVV(center, s, massData.center);
        // Inertia tensor relative to the local origin (point s).
        massData.I = density * I;
        // Shift to center of mass then to original body origin.
        massData.I += massData.mass * (b2_math_js_1.b2Vec2.DotVV(massData.center, massData.center) - b2_math_js_1.b2Vec2.DotVV(center, center));
    };
    b2PolygonShape.prototype.Validate = function () {
        for (var i = 0; i < this.m_count; ++i) {
            var i1 = i;
            var i2 = (i + 1) % this.m_count;
            var p = this.m_vertices[i1];
            var e = b2_math_js_1.b2Vec2.SubVV(this.m_vertices[i2], p, b2PolygonShape.Validate_s_e);
            for (var j = 0; j < this.m_count; ++j) {
                if (j === i1 || j === i2) {
                    continue;
                }
                var v = b2_math_js_1.b2Vec2.SubVV(this.m_vertices[j], p, b2PolygonShape.Validate_s_v);
                var c = b2_math_js_1.b2Vec2.CrossVV(e, v);
                if (c < 0) {
                    return false;
                }
            }
        }
        return true;
    };
    b2PolygonShape.prototype.SetupDistanceProxy = function (proxy, index) {
        proxy.m_vertices = this.m_vertices;
        proxy.m_count = this.m_count;
        proxy.m_radius = this.m_radius;
    };
    b2PolygonShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
        // Transform plane into shape co-ordinates
        var normalL = b2_math_js_1.b2Rot.MulTRV(xf.q, normal, b2PolygonShape.ComputeSubmergedArea_s_normalL);
        var offsetL = offset - b2_math_js_1.b2Vec2.DotVV(normal, xf.p);
        var depths = [];
        var diveCount = 0;
        var intoIndex = -1;
        var outoIndex = -1;
        var lastSubmerged = false;
        for (var i_1 = 0; i_1 < this.m_count; ++i_1) {
            depths[i_1] = b2_math_js_1.b2Vec2.DotVV(normalL, this.m_vertices[i_1]) - offsetL;
            var isSubmerged = depths[i_1] < (-b2_settings_js_1.b2_epsilon);
            if (i_1 > 0) {
                if (isSubmerged) {
                    if (!lastSubmerged) {
                        intoIndex = i_1 - 1;
                        diveCount++;
                    }
                }
                else {
                    if (lastSubmerged) {
                        outoIndex = i_1 - 1;
                        diveCount++;
                    }
                }
            }
            lastSubmerged = isSubmerged;
        }
        switch (diveCount) {
            case 0:
                if (lastSubmerged) {
                    // Completely submerged
                    var md = b2PolygonShape.ComputeSubmergedArea_s_md;
                    this.ComputeMass(md, 1);
                    b2_math_js_1.b2Transform.MulXV(xf, md.center, c);
                    return md.mass;
                }
                else {
                    // Completely dry
                    return 0;
                }
            case 1:
                if (intoIndex === (-1)) {
                    intoIndex = this.m_count - 1;
                }
                else {
                    outoIndex = this.m_count - 1;
                }
                break;
        }
        var intoIndex2 = ((intoIndex + 1) % this.m_count);
        var outoIndex2 = ((outoIndex + 1) % this.m_count);
        var intoLamdda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
        var outoLamdda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);
        var intoVec = b2PolygonShape.ComputeSubmergedArea_s_intoVec.Set(this.m_vertices[intoIndex].x * (1 - intoLamdda) + this.m_vertices[intoIndex2].x * intoLamdda, this.m_vertices[intoIndex].y * (1 - intoLamdda) + this.m_vertices[intoIndex2].y * intoLamdda);
        var outoVec = b2PolygonShape.ComputeSubmergedArea_s_outoVec.Set(this.m_vertices[outoIndex].x * (1 - outoLamdda) + this.m_vertices[outoIndex2].x * outoLamdda, this.m_vertices[outoIndex].y * (1 - outoLamdda) + this.m_vertices[outoIndex2].y * outoLamdda);
        // Initialize accumulator
        var area = 0;
        var center = b2PolygonShape.ComputeSubmergedArea_s_center.SetZero();
        var p2 = this.m_vertices[intoIndex2];
        var p3;
        // An awkward loop from intoIndex2+1 to outIndex2
        var i = intoIndex2;
        while (i !== outoIndex2) {
            i = (i + 1) % this.m_count;
            if (i === outoIndex2) {
                p3 = outoVec;
            }
            else {
                p3 = this.m_vertices[i];
            }
            var triangleArea = 0.5 * ((p2.x - intoVec.x) * (p3.y - intoVec.y) - (p2.y - intoVec.y) * (p3.x - intoVec.x));
            area += triangleArea;
            // Area weighted centroid
            center.x += triangleArea * (intoVec.x + p2.x + p3.x) / 3;
            center.y += triangleArea * (intoVec.y + p2.y + p3.y) / 3;
            p2 = p3;
        }
        // Normalize and transform centroid
        center.SelfMul(1 / area);
        b2_math_js_1.b2Transform.MulXV(xf, center, c);
        return area;
    };
    b2PolygonShape.prototype.Dump = function (log) {
        log("    const shape: b2PolygonShape = new b2PolygonShape();\n");
        log("    const vs: b2Vec2[] = [];\n");
        for (var i = 0; i < this.m_count; ++i) {
            log("    vs[%d] = new b2Vec2(%.15f, %.15f);\n", i, this.m_vertices[i].x, this.m_vertices[i].y);
        }
        log("    shape.Set(vs, %d);\n", this.m_count);
    };
    b2PolygonShape.ComputeCentroid = function (vs, count, out) {
        // DEBUG: b2Assert(count >= 3);
        var c = out;
        c.SetZero();
        var area = 0;
        // Get a reference point for forming triangles.
        // Use the first vertex to reduce round-off errors.
        var s = b2PolygonShape.ComputeCentroid_s_s.Copy(vs[0]);
        var inv3 = 1 / 3;
        for (var i = 0; i < count; ++i) {
            // Triangle vertices.
            var p1 = b2_math_js_1.b2Vec2.SubVV(vs[0], s, b2PolygonShape.ComputeCentroid_s_p1);
            var p2 = b2_math_js_1.b2Vec2.SubVV(vs[i], s, b2PolygonShape.ComputeCentroid_s_p2);
            var p3 = b2_math_js_1.b2Vec2.SubVV(vs[(i + 1) % count], s, b2PolygonShape.ComputeCentroid_s_p3);
            var e1 = b2_math_js_1.b2Vec2.SubVV(p2, p1, b2PolygonShape.ComputeCentroid_s_e1);
            var e2 = b2_math_js_1.b2Vec2.SubVV(p3, p1, b2PolygonShape.ComputeCentroid_s_e2);
            var D = b2_math_js_1.b2Vec2.CrossVV(e1, e2);
            var triangleArea = 0.5 * D;
            area += triangleArea;
            // Area weighted centroid
            c.x += triangleArea * inv3 * (p1.x + p2.x + p3.x);
            c.y += triangleArea * inv3 * (p1.y + p2.y + p3.y);
        }
        // Centroid
        // DEBUG: b2Assert(area > b2_epsilon);
        // c = (1.0f / area) * c + s;
        c.x = (1 / area) * c.x + s.x;
        c.y = (1 / area) * c.y + s.y;
        return c;
    };
    /// Create a convex hull from the given array of points.
    /// @warning the points may be re-ordered, even if they form a convex polygon
    /// @warning collinear points are handled but not removed. Collinear points
    /// may lead to poor stacking behavior.
    b2PolygonShape.Set_s_r = new b2_math_js_1.b2Vec2();
    b2PolygonShape.Set_s_v = new b2_math_js_1.b2Vec2();
    /// @see b2Shape::TestPoint
    b2PolygonShape.TestPoint_s_pLocal = new b2_math_js_1.b2Vec2();
    // #if B2_ENABLE_PARTICLE
    /// @see b2Shape::ComputeDistance
    b2PolygonShape.ComputeDistance_s_pLocal = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeDistance_s_normalForMaxDistance = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeDistance_s_minDistance = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeDistance_s_distance = new b2_math_js_1.b2Vec2();
    // #endif
    /// Implement b2Shape.
    /// @note because the polygon is solid, rays that start inside do not hit because the normal is
    /// not defined.
    b2PolygonShape.RayCast_s_p1 = new b2_math_js_1.b2Vec2();
    b2PolygonShape.RayCast_s_p2 = new b2_math_js_1.b2Vec2();
    b2PolygonShape.RayCast_s_d = new b2_math_js_1.b2Vec2();
    /// @see b2Shape::ComputeAABB
    b2PolygonShape.ComputeAABB_s_v = new b2_math_js_1.b2Vec2();
    /// @see b2Shape::ComputeMass
    b2PolygonShape.ComputeMass_s_center = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeMass_s_s = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeMass_s_e1 = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeMass_s_e2 = new b2_math_js_1.b2Vec2();
    b2PolygonShape.Validate_s_e = new b2_math_js_1.b2Vec2();
    b2PolygonShape.Validate_s_v = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeSubmergedArea_s_normalL = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeSubmergedArea_s_md = new b2_shape_js_1.b2MassData();
    b2PolygonShape.ComputeSubmergedArea_s_intoVec = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeSubmergedArea_s_outoVec = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeSubmergedArea_s_center = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeCentroid_s_s = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeCentroid_s_p1 = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeCentroid_s_p2 = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeCentroid_s_p3 = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeCentroid_s_e1 = new b2_math_js_1.b2Vec2();
    b2PolygonShape.ComputeCentroid_s_e2 = new b2_math_js_1.b2Vec2();
    return b2PolygonShape;
}(b2_shape_js_2.b2Shape));
exports.b2PolygonShape = b2PolygonShape;
