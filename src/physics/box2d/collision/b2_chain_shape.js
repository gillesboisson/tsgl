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
exports.b2ChainShape = void 0;
// DEBUG: import { b2Assert, b2_linearSlop } from "../common/b2_settings";
var b2_settings_js_1 = require("../common/b2_settings.js");
var b2_math_js_1 = require("../common/b2_math.js");
var b2_shape_js_1 = require("./b2_shape.js");
var b2_edge_shape_js_1 = require("./b2_edge_shape.js");
/// A chain shape is a free form sequence of line segments.
/// The chain has one-sided collision, with the surface normal pointing to the right of the edge.
/// This provides a counter-clockwise winding like the polygon shape.
/// Connectivity information is used to create smooth collisions.
/// @warning the chain will not collide properly if there are self-intersections.
var b2ChainShape = /** @class */ (function (_super) {
    __extends(b2ChainShape, _super);
    function b2ChainShape() {
        var _this = _super.call(this, b2_shape_js_1.b2ShapeType.e_chainShape, b2_settings_js_1.b2_polygonRadius) || this;
        _this.m_vertices = [];
        _this.m_count = 0;
        _this.m_prevVertex = new b2_math_js_1.b2Vec2();
        _this.m_nextVertex = new b2_math_js_1.b2Vec2();
        return _this;
    }
    b2ChainShape.prototype.CreateLoop = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (typeof args[0][0] === "number") {
            var vertices_1 = args[0];
            if (vertices_1.length % 2 !== 0) {
                throw new Error();
            }
            return this._CreateLoop(function (index) { return ({ x: vertices_1[index * 2], y: vertices_1[index * 2 + 1] }); }, vertices_1.length / 2);
        }
        else {
            var vertices_2 = args[0];
            var count = args[1] || vertices_2.length;
            return this._CreateLoop(function (index) { return vertices_2[index]; }, count);
        }
    };
    b2ChainShape.prototype._CreateLoop = function (vertices, count) {
        // DEBUG: b2Assert(count >= 3);
        if (count < 3) {
            return this;
        }
        // DEBUG: for (let i: number = 1; i < count; ++i) {
        // DEBUG:   const v1 = vertices[start + i - 1];
        // DEBUG:   const v2 = vertices[start + i];
        // DEBUG:   // If the code crashes here, it means your vertices are too close together.
        // DEBUG:   b2Assert(b2Vec2.DistanceSquaredVV(v1, v2) > b2_linearSlop * b2_linearSlop);
        // DEBUG: }
        this.m_count = count + 1;
        this.m_vertices = b2_math_js_1.b2Vec2.MakeArray(this.m_count);
        for (var i = 0; i < count; ++i) {
            this.m_vertices[i].Copy(vertices(i));
        }
        this.m_vertices[count].Copy(this.m_vertices[0]);
        this.m_prevVertex.Copy(this.m_vertices[this.m_count - 2]);
        this.m_nextVertex.Copy(this.m_vertices[1]);
        return this;
    };
    b2ChainShape.prototype.CreateChain = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (typeof args[0][0] === "number") {
            var vertices_3 = args[0];
            var prevVertex = args[1];
            var nextVertex = args[2];
            if (vertices_3.length % 2 !== 0) {
                throw new Error();
            }
            return this._CreateChain(function (index) { return ({ x: vertices_3[index * 2], y: vertices_3[index * 2 + 1] }); }, vertices_3.length / 2, prevVertex, nextVertex);
        }
        else {
            var vertices_4 = args[0];
            var count = args[1] || vertices_4.length;
            var prevVertex = args[2];
            var nextVertex = args[3];
            return this._CreateChain(function (index) { return vertices_4[index]; }, count, prevVertex, nextVertex);
        }
    };
    b2ChainShape.prototype._CreateChain = function (vertices, count, prevVertex, nextVertex) {
        // DEBUG: b2Assert(count >= 2);
        // DEBUG: for (let i: number = 1; i < count; ++i) {
        // DEBUG:   const v1 = vertices[start + i - 1];
        // DEBUG:   const v2 = vertices[start + i];
        // DEBUG:   // If the code crashes here, it means your vertices are too close together.
        // DEBUG:   b2Assert(b2Vec2.DistanceSquaredVV(v1, v2) > b2_linearSlop * b2_linearSlop);
        // DEBUG: }
        this.m_count = count;
        this.m_vertices = b2_math_js_1.b2Vec2.MakeArray(count);
        for (var i = 0; i < count; ++i) {
            this.m_vertices[i].Copy(vertices(i));
        }
        this.m_prevVertex.Copy(prevVertex);
        this.m_nextVertex.Copy(nextVertex);
        return this;
    };
    /// Implement b2Shape. Vertices are cloned using b2Alloc.
    b2ChainShape.prototype.Clone = function () {
        return new b2ChainShape().Copy(this);
    };
    b2ChainShape.prototype.Copy = function (other) {
        _super.prototype.Copy.call(this, other);
        // DEBUG: b2Assert(other instanceof b2ChainShape);
        this._CreateChain(function (index) { return other.m_vertices[index]; }, other.m_count, other.m_prevVertex, other.m_nextVertex);
        this.m_prevVertex.Copy(other.m_prevVertex);
        this.m_nextVertex.Copy(other.m_nextVertex);
        return this;
    };
    /// @see b2Shape::GetChildCount
    b2ChainShape.prototype.GetChildCount = function () {
        // edge count = vertex count - 1
        return this.m_count - 1;
    };
    /// Get a child edge.
    b2ChainShape.prototype.GetChildEdge = function (edge, index) {
        // DEBUG: b2Assert(0 <= index && index < this.m_count - 1);
        edge.m_radius = this.m_radius;
        edge.m_vertex1.Copy(this.m_vertices[index]);
        edge.m_vertex2.Copy(this.m_vertices[index + 1]);
        edge.m_oneSided = true;
        if (index > 0) {
            edge.m_vertex0.Copy(this.m_vertices[index - 1]);
        }
        else {
            edge.m_vertex0.Copy(this.m_prevVertex);
        }
        if (index < this.m_count - 2) {
            edge.m_vertex3.Copy(this.m_vertices[index + 2]);
        }
        else {
            edge.m_vertex3.Copy(this.m_nextVertex);
        }
    };
    /// This always return false.
    /// @see b2Shape::TestPoint
    b2ChainShape.prototype.TestPoint = function (xf, p) {
        return false;
    };
    b2ChainShape.prototype.ComputeDistance = function (xf, p, normal, childIndex) {
        var edge = b2ChainShape.ComputeDistance_s_edgeShape;
        this.GetChildEdge(edge, childIndex);
        return edge.ComputeDistance(xf, p, normal, 0);
    };
    b2ChainShape.prototype.RayCast = function (output, input, xf, childIndex) {
        // DEBUG: b2Assert(childIndex < this.m_count);
        var edgeShape = b2ChainShape.RayCast_s_edgeShape;
        edgeShape.m_vertex1.Copy(this.m_vertices[childIndex]);
        edgeShape.m_vertex2.Copy(this.m_vertices[(childIndex + 1) % this.m_count]);
        return edgeShape.RayCast(output, input, xf, 0);
    };
    b2ChainShape.prototype.ComputeAABB = function (aabb, xf, childIndex) {
        // DEBUG: b2Assert(childIndex < this.m_count);
        var vertexi1 = this.m_vertices[childIndex];
        var vertexi2 = this.m_vertices[(childIndex + 1) % this.m_count];
        var v1 = b2_math_js_1.b2Transform.MulXV(xf, vertexi1, b2ChainShape.ComputeAABB_s_v1);
        var v2 = b2_math_js_1.b2Transform.MulXV(xf, vertexi2, b2ChainShape.ComputeAABB_s_v2);
        var lower = b2_math_js_1.b2Vec2.MinV(v1, v2, b2ChainShape.ComputeAABB_s_lower);
        var upper = b2_math_js_1.b2Vec2.MaxV(v1, v2, b2ChainShape.ComputeAABB_s_upper);
        aabb.lowerBound.x = lower.x - this.m_radius;
        aabb.lowerBound.y = lower.y - this.m_radius;
        aabb.upperBound.x = upper.x + this.m_radius;
        aabb.upperBound.y = upper.y + this.m_radius;
    };
    /// Chains have zero mass.
    /// @see b2Shape::ComputeMass
    b2ChainShape.prototype.ComputeMass = function (massData, density) {
        massData.mass = 0;
        massData.center.SetZero();
        massData.I = 0;
    };
    b2ChainShape.prototype.SetupDistanceProxy = function (proxy, index) {
        // DEBUG: b2Assert(0 <= index && index < this.m_count);
        proxy.m_vertices = proxy.m_buffer;
        proxy.m_vertices[0].Copy(this.m_vertices[index]);
        if (index + 1 < this.m_count) {
            proxy.m_vertices[1].Copy(this.m_vertices[index + 1]);
        }
        else {
            proxy.m_vertices[1].Copy(this.m_vertices[0]);
        }
        proxy.m_count = 2;
        proxy.m_radius = this.m_radius;
    };
    b2ChainShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
        c.SetZero();
        return 0;
    };
    b2ChainShape.prototype.Dump = function (log) {
        log("    const shape: b2ChainShape = new b2ChainShape();\n");
        log("    const vs: b2Vec2[] = [];\n");
        for (var i = 0; i < this.m_count; ++i) {
            log("    vs[%d] = new bVec2(%.15f, %.15f);\n", i, this.m_vertices[i].x, this.m_vertices[i].y);
        }
        log("    shape.CreateChain(vs, %d);\n", this.m_count);
        log("    shape.m_prevVertex.Set(%.15f, %.15f);\n", this.m_prevVertex.x, this.m_prevVertex.y);
        log("    shape.m_nextVertex.Set(%.15f, %.15f);\n", this.m_nextVertex.x, this.m_nextVertex.y);
    };
    // #if B2_ENABLE_PARTICLE
    /// @see b2Shape::ComputeDistance
    b2ChainShape.ComputeDistance_s_edgeShape = new b2_edge_shape_js_1.b2EdgeShape();
    // #endif
    /// Implement b2Shape.
    b2ChainShape.RayCast_s_edgeShape = new b2_edge_shape_js_1.b2EdgeShape();
    /// @see b2Shape::ComputeAABB
    b2ChainShape.ComputeAABB_s_v1 = new b2_math_js_1.b2Vec2();
    b2ChainShape.ComputeAABB_s_v2 = new b2_math_js_1.b2Vec2();
    b2ChainShape.ComputeAABB_s_lower = new b2_math_js_1.b2Vec2();
    b2ChainShape.ComputeAABB_s_upper = new b2_math_js_1.b2Vec2();
    return b2ChainShape;
}(b2_shape_js_1.b2Shape));
exports.b2ChainShape = b2ChainShape;
